import subprocess
import os
import google.generativeai as genai
import textwrap
import sys
from dotenv import load_dotenv # Import load_dotenv

# --- Configuration ---
# Load environment variables from .env file
load_dotenv()

# Recommended: set GOOGLE_API_KEY in your .env file in the project root
GEMINI_API_KEY = ''

if not GEMINI_API_KEY:
    print("Error: GOOGLE_API_KEY not found.")
    print("Please create a .env file in your project root with GOOGLE_API_KEY='YOUR_API_KEY_HERE'")
    sys.exit(1) # Use sys.exit to properly exit

genai.configure(api_key=GEMINI_API_KEY)
GEMINI_MODEL_NAME = "gemini-1.5-flash" # Or "gemini-1.5-pro" if preferred

# --- Helper Functions for Git Commands ---
def run_git_command(command_parts, cwd=None, check=True, capture_output=True, text=True, dry_run=False):
    """
    Runs a git command using subprocess.
    :param command_parts: List of command parts, e.g., ['git', 'status']
    :param cwd: Current working directory for the command.
    :param check: If True, raise CalledProcessError on non-zero exit code.
    :param capture_output: If True, stdout and stderr will be captured.
    :param text: If True, decode stdout/stderr as text.
    :param dry_run: If True, only print the command, do not execute.
    :return: CompletedProcess object or None if dry_run.
    """
    command_str = ' '.join(command_parts)
    if dry_run:
        print(f"[DRY RUN] Would execute: {command_str}")
        return None

    try:
        result = subprocess.run(
            command_parts,
            cwd=cwd,
            check=check,
            capture_output=capture_output,
            text=text,
            encoding='utf-8',
            errors='ignore'
        )
        return result
    except subprocess.CalledProcessError as e:
        print(f"Error executing git command: {command_str}")
        print(f"Stderr: {e.stderr}")
        raise # Re-raise the exception for upstream handling

# --- AI Interaction ---
def generate_commit_message(diff_output):
    prompt = textwrap.dedent(f"""
    You are an expert software developer assisting in writing concise and clear Git commit messages.
    Analyze the following git diff and generate a commit message that adheres to the following best practices:

    1.  **Subject Line**:
        *   Limit to 50 characters.
        *   Capitalize the first letter.
        *   Do NOT end with a period.
        *   Use the imperative mood (e.g., "Add feature", "Fix bug", "Refactor code").
        *   Consider Conventional Commits types (feat:, fix:, chore:, docs:, refactor:, style:, test:, build:, ci:, perf:, revert:) if applicable.

    2.  **Body (Optional)**:
        *   Separate from the subject with a blank line.
        *   Wrap at 72 characters.
        *   Explain *what* the change does and *why* it was necessary.
        *   Avoid describing *how* (the code itself should explain that).
        *   Add bullet points if multiple points are needed, separated by blank lines.

    Here is the git diff:
    ```diff
    {diff_output}
    ```

    Generate only the commit message.
    """)

    model = genai.GenerativeModel(GEMINI_MODEL_NAME)
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error generating commit message with Gemini: {e}")
        return None

# --- User Interaction ---
def get_user_confirmation(prompt):
    while True:
        response = input(f"{prompt} (y/n): ").lower().strip()
        if response in ['y', 'yes']:
            return True
        elif response in ['n', 'no']:
            return False
        else:
            print("Invalid input. Please enter 'y' or 'n'.")

def edit_message_interactively(initial_message):
    """
    Opens a temporary file with the initial_message in a text editor (e.g., nano)
    and returns the edited content.
    """
    editor = os.environ.get('EDITOR', 'nano') # Use EDITOR env var or default to nano
    temp_file_path = "COMMIT_EDITMSG.txt"
    with open(temp_file_path, "w") as f:
        f.write(initial_message)

    try:
        subprocess.run([editor, temp_file_path], check=True)
        with open(temp_file_path, "r") as f:
            edited_message = f.read().strip()
        return edited_message
    except subprocess.CalledProcessError:
        print("Error: Failed to open editor or editor exited with error. Returning original message.")
        return initial_message
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

# --- Main Script Logic ---
def main():
    # Check for dry run argument
    dry_run = "--dry-run" in sys.argv

    if dry_run:
        print("\n--- Running pushcode script in DRY RUN mode ---")
        print("    (No Git commands will be executed)")
    else:
        print("\n--- Running pushcode script ---")

    while True:
        # 1. Get git diff
        print("Getting git diff...")
        try:
            # We always run git diff even in dry_run to get the content for AI
            diff_result = run_git_command(['git', 'diff'], dry_run=False) # Always execute diff
            if not diff_result.stdout.strip():
                print("No changes detected. Exiting.")
                return
            git_diff = diff_result.stdout
            print("Git diff obtained.")
        except Exception as e:
            print(f"Failed to get git diff: {e}")
            if not get_user_confirmation("Would you like to try again?"):
                return
            continue

        # 2. Generate commit message
        print("Generating commit message with Gemini...")
        commit_message = generate_commit_message(git_diff)
        if not commit_message:
            if not get_user_confirmation("Failed to generate commit message. Try again?"):
                return
            continue

        # 3. User review and edit
        while True:
            print("\n--- Generated Commit Message ---")
            print(commit_message)
            print("---------------------------------")
            action = input("Options: (a)ccept and commit, (e)dit, (r)e-generate, (c)ancel: ").lower().strip()

            if action in ['a', 'accept']:
                break
            elif action in ['e', 'edit']:
                commit_message = edit_message_interactively(commit_message)
                print("Message edited.")
            elif action in ['r', 're-generate']:
                print("Re-generating commit message...")
                new_message = generate_commit_message(git_diff)
                if new_message:
                    commit_message = new_message
                else:
                    print("Could not re-generate. Keeping current message.")
            elif action in ['c', 'cancel']:
                print("Commit generation cancelled. Exiting.")
                return
            else:
                print("Invalid option.")

        # 4. Git add
        print("Staging all changes with 'git add .'...")
        try:
            run_git_command(['git', 'add', '.'], dry_run=dry_run)
            if not dry_run:
                print("Changes staged.")
        except Exception as e:
            print(f"Failed to stage changes: {e}")
            if not get_user_confirmation("Would you like to try staging again?"):
                return
            continue

        # 5. Git commit
        print("Committing changes...")
        try:
            run_git_command(['git', 'commit', '-m', commit_message], dry_run=dry_run)
            if not dry_run:
                print("Changes committed successfully.")
            else:
                print(f"[DRY RUN] Would commit with message:\n{commit_message}")
        except Exception as e:
            print(f"Failed to commit changes: {e}")
            if not get_user_confirmation("Would you like to re-edit the message and try committing again?"):
                return
            continue

        # 6. Git push approval
        if get_user_confirmation("Commit successful. Do you want to push to remote?"):
            print("Pushing changes...")
            try:
                run_git_command(['git', 'push'], dry_run=dry_run)
                if not dry_run:
                    print("Changes pushed successfully.")
                    print("--- pushcode script completed ---")
                else:
                    print("[DRY RUN] Would have pushed changes.")
                    print("--- pushcode script dry run completed ---")
                return
            except Exception as e:
                print(f"Failed to push changes: {e}")
                if not get_user_confirmation("Would you like to try pushing again?"):
                    continue
                else:
                    print("Push cancelled. Exiting.")
                    return
        else:
            print("Push cancelled. Exiting.")
            return

if __name__ == "__main__":
    main()