# About: Word Frequency List Obsidian Plugin

## What is this plugin?
The **Word Frequency List** plugin for Obsidian scans your entire vault and lists all the words it finds, sorted from most frequent to least frequent. It provides a simple way to analyze the vocabulary and word usage patterns in your notes.

---

## Features

- **Word Frequency List View:**
  - Shows the most common words in your vault, sorted by frequency.

- **Clickable Words:**
  - Each word in the frequency list is clickable.
  - Clicking a word opens a new **Word Notes View**.

- **Word Notes View:**
  - Displays the selected word as the title.
  - Includes a back button to return to the main frequency list.
  - Lists all notes in your vault that contain the selected word.
  - Each note in the list is clickable and will open the corresponding note.
  - **Sortable List:** Includes buttons to sort the list of notes alphabetically by path (A-Z or Z-A) or by creation date (oldest first or newest first).

- **Hide Words:**
  - Each word in the frequency list has a "Hide" button that appears when you hover over the word.
  - Click "Hide" to remove the word from the main list. Hidden words are stored persistently and will remain hidden across Obsidian restarts.

- **Manage Hidden Words:**
  - Hidden words are displayed in a collapsible section at the bottom of the frequency list view.
  - Each hidden word has an "Unhide" button, allowing you to restore it to the main list instantly.

- **Persistent Settings:**
  - Hidden words are saved in the plugin's settings and are preserved between sessions.

- **Modern UI/UX:**
  - Hide/Unhide buttons are styled to be unobtrusive, only appearing on hover for a clean look.
  - The hidden words section can be expanded or collapsed to keep your workspace tidy.
  - The Word Notes view provides easy navigation between the frequency list and individual notes, with added sorting capabilities.

## How does it work?
- The plugin adds a command to Obsidian: **Show Word Frequency List**.
- When you run this command (via the command palette), a new panel opens in Obsidian.
- The plugin automatically scans all Markdown files in your vault.
- It counts every word (case-insensitive), and sorts them in descending order by frequency.
- The results are displayed as a list: each line shows a word and the number of times it appears in your vault.
- Clicking on a word in the list opens a new view showing all notes containing that specific word. This view allows sorting the notes by name or creation date.

## Use Cases
- Discover your most-used words or topics.
- Spot overused filler words or repetitive phrasing.
- Analyze your writing style or vocabulary growth over time.
- Quickly find all notes related to a specific frequently used term.

---

This is the initial version. More features can be added as needed!
