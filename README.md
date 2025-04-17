# Word Frequency List for Obsidian

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

Discover the most frequently used words across your Obsidian vault and explore the notes containing them. This provides an alternative way to visualize connections between notes based on shared vocabulary, going beyond explicit links or tags to help you find potentially related ideas.

## What is this plugin?

This plugin scans all the Markdown files in your Obsidian vault and builds a list of words sorted by how often they appear. It helps you identify key themes, recurring concepts, or perhaps overused words in your notes.

## Features

*   **Frequency List:** View a ranked list of words based on their usage count across your entire vault.
*   **Ignore Common Words:** Easily hide words (like "the", "a", "is") from the list that you don't want to track.
*   **Unhide Words:** View and manage your list of hidden words.
*   **Explore Connections:** Click on any word in the list to open a dedicated view showing all notes containing that specific word.
*   **Word Notes View:**
    *   See a list of all notes containing the selected word.
    *   Sort the list of notes by path or creation date (ascending/descending).
    *   Quickly navigate back to the main frequency list.
    *   **Create a "Word List Note":** Generate a new note titled `Word List - [word]` containing links (`[[Note Path]]`) to all the notes listed in the current view. This is useful for creating indexes or seeing related notes at a glance.
*   **Save Frequency List:** Export the current word frequency list (both visible and hidden words) into a new Markdown note.
*   **Reset Hidden Words:** Clear your entire list of hidden words.

## How might you use this?

*   **Identify Core Concepts:** See which terms dominate your notes to understand the main topics you write about.
*   **Find Overused Words:** Spot words you might be using too repetitively and consider alternatives.
*   **Discover Related Notes:** Click a word related to a topic you're exploring (e.g., "productivity") to quickly find all notes mentioning it.
*   **Build Topic Indexes:** Use the "Create Note From List" feature on the Word Notes View to create Map of Content (MOC)-style notes for specific keywords, linking together all relevant documents.
*   **Language Learning:** If using Obsidian for language notes, track the vocabulary you use most often.

## Installation

### From Community Plugins (Recommended)

*(Once the plugin is submitted and approved)*

1.  Go to `Settings` -> `Community plugins`.
2.  Ensure `Safe mode` is **off**.
3.  Click `Browse` community plugins.
4.  Search for "Word Frequency List".
5.  Click `Install`.
6.  Once installed, click `Enable` on the plugin in your installed plugins list.

### Manual Installation

1.  Download the `main.js`, `styles.css`, and `manifest.json` files from the [Latest Release](https://github.com/your-username/your-repo-name/releases/latest) on GitHub.
2.  Navigate to your vault's plugins folder: `VaultFolder/.obsidian/plugins/`.
3.  Create a new folder named `word-frequency-list`.
4.  Copy the downloaded `main.js`, `styles.css`, and `manifest.json` files into this new folder.
5.  Reload Obsidian (Ctrl+R or Cmd+R).
6.  Go to `Settings` -> `Community plugins`, find "Word Frequency List" and enable it.

## License

This plugin is released under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

*Created with help from an AI assistant.*
