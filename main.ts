import { App, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, ItemView, TFile, Vault, Menu, Notice, TAbstractFile, ViewStateResult, setIcon } from 'obsidian';

const VIEW_TYPE_WORD_FREQ = "word-frequency-list-view";
const VIEW_TYPE_WORD_NOTES = "word-notes-view";

interface WordFrequencySettings {
  hiddenWords: string[];
}

const DEFAULT_SETTINGS: WordFrequencySettings = {
  hiddenWords: [],
};

export default class WordFrequencyPlugin extends Plugin {
  settings!: WordFrequencySettings;

  async onload() {
    await this.loadSettings();
    this.registerView(
      VIEW_TYPE_WORD_FREQ,
      (leaf) => new WordFrequencyView(leaf, this.app.vault, this)
    );
    this.registerView(
      VIEW_TYPE_WORD_NOTES,
      (leaf) => new WordNotesView(leaf, this.app.vault, this)
    );
    this.addCommand({
      id: "open-word-frequency-list",
      name: "Show Word Frequency List",
      callback: () => {
        this.activateView();
      },
    });
    this.injectWordFreqCss();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  injectWordFreqCss() {
    if (document.getElementById('word-freq-hide-style')) return;
    const style = document.createElement('style');
    style.id = 'word-freq-hide-style';
    style.textContent = `
.word-freq-table {
  margin-left: 0.2em;
}
.word-freq-row {
  display: flex;
  align-items: center;
  padding: 0.5em 0.1em 0.5em 0.1em;
  border-bottom: 1px solid var(--background-modifier-border, #ddd);
  margin-bottom: 0;
  position: relative;
  justify-content: space-between;
  cursor: pointer;
}
.word-freq-row:hover {
  background-color: var(--background-modifier-hover);
}
.word-freq-word-wrap {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1 1 auto;
}
.word-freq-word {
  font-size: 1.08em;
  color: var(--text-normal);
  font-family: inherit;
  font-weight: 500;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 0.5em;
}
.word-freq-count {
  flex: none;
  min-width: 30px;
  font-size: 0.9em;
  color: var(--text-muted);
  font-family: inherit;
  font-weight: bold;
  margin-left: 1em;
  margin-right: 0.6em;
  text-align: right;
  letter-spacing: 0.01em;
}
.word-freq-hide-btn {
  opacity: 0;
  pointer-events: none;
  background: none !important;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  padding: 0 4px !important;
  margin-left: 0.5em;
  font-size: 0.85em;
  font-weight: 400;
  color: var(--text-faint);
  cursor: pointer;
  border-radius: 3px;
  transition: color 0.15s, opacity 0.15s, background-color 0.15s;
  display: inline;
  vertical-align: middle;
}
.word-freq-row:hover .word-freq-hide-btn {
  opacity: 0.7;
  pointer-events: auto;
}
.word-freq-hide-btn:hover {
  color: var(--text-error, #d55);
  text-decoration: underline;
  opacity: 1;
  background-color: var(--background-modifier-hover, #eee);
}

.word-freq-hidden-disclosure {
  margin-top: 2em;
}
.word-freq-hidden-disclosure summary {
  cursor: pointer;
  color: var(--text-muted);
}
.word-freq-hidden-disclosure ul {
  padding-left: 1.5em;
  list-style: none;
}
.word-freq-hidden-disclosure li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.2em;
  color: var(--text-normal);
}

.word-freq-unhide-btn {
  opacity: 0.6;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-green, #2a2);
  font-size: 0.9em;
  margin-left: 0.5em;
  padding: 1px 6px;
  border-radius: 3px;
  transition: opacity 0.15s, background-color 0.15s;
}
.word-freq-unhide-btn:hover {
  opacity: 1;
  background: var(--background-modifier-success, #e5ffe5);
}

/* Styles for Word Notes View */
.word-notes-header {
  display: flex;
  align-items: center;
  margin-bottom: 1em;
}
.word-notes-back-button {
  /* Increase margin for more space */
  margin-right: 0.8em;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 1.2em;
  padding: 2px 6px;
}
.word-notes-back-button:hover {
    background-color: var(--background-modifier-hover);
}
.word-notes-header h2 {
    margin: 0;
}
.word-notes-list {
    /* Remove bullets and default padding */
    list-style: none;
    padding-left: 0.2em; /* Add slight indent */
}
.word-notes-list li {
    margin-bottom: 0.5em;
    cursor: pointer;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    /* Add underline to mimic link */
    text-decoration: underline;
}
.word-notes-list li:hover {
    background-color: var(--background-modifier-hover);
}

.word-notes-sort-controls {
  margin-bottom: 1em;
  display: flex;
  gap: 0.5em;
}

.word-notes-create-list-button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-normal);
  font-size: 0.9em;
  padding: 1px 6px;
  border-radius: 3px;
  transition: opacity 0.15s, background-color 0.15s;
}
.word-notes-create-list-button:hover {
  opacity: 1;
  background: var(--background-modifier-hover);
}
    `;
    document.head.appendChild(style);
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_WORD_FREQ);
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_WORD_NOTES);
    const style = document.getElementById('word-freq-hide-style');
    if (style) style.remove();
  }

  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_WORD_FREQ)[0];
    if (!leaf) {
        const newLeaf = workspace.getRightLeaf(false);
        if (!newLeaf) return;
        leaf = newLeaf;
        await leaf.setViewState({
            type: VIEW_TYPE_WORD_FREQ,
            active: true,
        });
    }
    workspace.revealLeaf(leaf);
  }

  async activateWordNotesView(word: string) {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_WORD_NOTES)[0];
    if (!leaf) {
      const newLeaf = workspace.getRightLeaf(false);
      if (!newLeaf) return;
      leaf = newLeaf;
    }
    await leaf.setViewState({ type: VIEW_TYPE_WORD_NOTES, active: true, state: { word } });
    workspace.revealLeaf(leaf);
  }
}


class WordFrequencyView extends ItemView {
  vault: Vault;
  plugin: WordFrequencyPlugin;
  currentFreqList: [string, number][] = [];

  constructor(leaf: WorkspaceLeaf, vault: Vault, plugin: WordFrequencyPlugin) {
    super(leaf);
    this.vault = vault;
    this.plugin = plugin;
  }

	getViewType() { return VIEW_TYPE_WORD_FREQ; }
	getDisplayText() { return "Word Frequency List"; }

	async onOpen() {
		const container = this.contentEl;
		container.empty();

		const headerDiv = container.createEl("div", { cls: "word-freq-header" });
		headerDiv.style.display = "flex";
		headerDiv.style.justifyContent = "space-between";
		headerDiv.style.alignItems = "center";
		headerDiv.style.marginBottom = "1em";

		headerDiv.createEl("h2", { text: "Word Frequency List" });

		const moreButton = headerDiv.createEl("button", { cls: "word-freq-more-button" });
		moreButton.innerHTML = "•••";
		moreButton.style.background = "transparent";
		moreButton.style.border = "none";
		moreButton.style.cursor = "pointer";
		moreButton.style.fontSize = "16px";
		moreButton.style.padding = "4px 8px";
		moreButton.style.borderRadius = "4px";
		moreButton.style.transition = "background-color 0.2s ease";
		moreButton.addEventListener("mouseover", () => { moreButton.style.backgroundColor = "var(--background-modifier-hover)"; });
		moreButton.addEventListener("mouseout", () => { moreButton.style.backgroundColor = "transparent"; });
		moreButton.addEventListener("click", (event) => {
			const menu = new Menu();
			menu.addItem((item) => {
				item
					.setTitle("Reload")
					.setIcon("refresh-cw")
					.onClick(async () => {
						console.log("Reload clicked");
						new Notice("Reloading word frequency list...");
						await this.renderWordFrequencyList(container);
					});
			});

			menu.addItem((item) => {
				item
					.setTitle("Save as note")
					.setIcon("save")
					.onClick(async () => {
						console.log("Save as note clicked");
						await this.saveListAsNote();
					});
			});

			menu.addItem((item) => {
				item
					.setTitle("Reset hidden words")
					.setIcon("eraser")
					.onClick(async () => {
						console.log("Reset hidden words clicked");
						if (this.plugin.settings.hiddenWords.length > 0) {
							this.plugin.settings.hiddenWords = [];
							await this.plugin.saveSettings();
							new Notice("Hidden words have been reset.");
							await this.renderWordFrequencyList(container);
						} else {
							new Notice("No words are currently hidden.");
						}
					});
			});

			menu.showAtMouseEvent(event);
		});

		await this.renderWordFrequencyList(container);
	}

	async renderWordFrequencyList(container: HTMLElement) {
		const oldTable = container.querySelector(".word-freq-table");
		if (oldTable) oldTable.remove();
		const oldDisclosure = container.querySelector("details.word-freq-hidden-disclosure");
		if (oldDisclosure) oldDisclosure.remove();

		this.currentFreqList = await this.computeWordFrequencies();
		const hiddenWords = this.plugin.settings.hiddenWords;
		const visibleList = this.currentFreqList.filter(([word]) => !hiddenWords.includes(word));

		const table = container.createEl("div", { cls: "word-freq-table" });
		for (const [word, count] of visibleList) {
			const row = table.createEl("div", { cls: "word-freq-row" });
			row.onclick = async () => { await this.plugin.activateWordNotesView(word); };

			const wordWrap = row.createEl("span", { cls: "word-freq-word-wrap" });
			const wordSpan = wordWrap.createEl("span", { cls: "word-freq-word" });
			wordSpan.innerText = word;
			const hideBtn = wordWrap.createEl("button", { cls: 'word-freq-hide-btn' });
			hideBtn.innerText = "hide";
			hideBtn.title = "Hide this word";
			hideBtn.onclick = async (e) => {
				e.stopPropagation();
				if (!hiddenWords.includes(word)) {
					hiddenWords.push(word);
					await this.plugin.saveSettings();
					await this.renderWordFrequencyList(container);
				}
			};

			const countCell = row.createEl("span", { cls: "word-freq-count" });
			countCell.innerText = String(count);
		}

		if (hiddenWords.length > 0) {
			const disclosure = container.createEl("details", { cls: "word-freq-hidden-disclosure" });
			disclosure.style.marginTop = "2em";
			const summary = disclosure.createEl("summary");
			summary.innerText = `Hidden words (${hiddenWords.length})`;
			const hiddenList = disclosure.createEl("ul");
			const sortedHidden = [...hiddenWords].sort();
			for (const word of sortedHidden) {
				const li = hiddenList.createEl("li");
				li.style.display = "flex";
				li.style.alignItems = "center";
				li.style.justifyContent = "space-between";
				const wordSpan = li.createEl("span");
				wordSpan.setText(word);
				wordSpan.style.flex = "1";
				const unhideBtn = li.createEl("button", { cls: 'word-freq-unhide-btn' });
				unhideBtn.innerText = "unhide";
				unhideBtn.title = "Unhide this word";
				unhideBtn.onclick = async (e) => {
					e.stopPropagation();
					const idx = hiddenWords.indexOf(word);
					if (idx !== -1) {
						hiddenWords.splice(idx, 1);
						await this.plugin.saveSettings();
						await this.renderWordFrequencyList(container);
					}
				};
			}
		}
	}

	async computeWordFrequencies(): Promise<[string, number][]> {
		const files = this.vault.getMarkdownFiles();
		const freq: Record<string, number> = {};
		for (const file of files) {
			const content = await this.vault.cachedRead(file);
			const words = content.match(/\b\w+\b/g);
			if (words) {
				for (const word of words) {
					const lower = word.toLowerCase();
					if (lower.length > 2) { freq[lower] = (freq[lower] || 0) + 1; }
				}
			}
		}
		return Object.entries(freq).sort((a, b) => b[1] - a[1]);
	}

	async saveListAsNote() {
		const hiddenWords = this.plugin.settings.hiddenWords;
		const visibleList = this.currentFreqList.filter(([word]) => !hiddenWords.includes(word));
		let content = "# Word Frequency List\n\n";
		content += "## Visible Words\n\n";
		if (visibleList.length > 0) {
			content += "| Word | Count |\n";
			content += "|---|---|\n";
			visibleList.forEach(([word, count]) => {
				content += `| ${word} | ${count} |\n`;
			});
		} else {
			content += "_No visible words found._\n";
		}

		if (hiddenWords.length > 0) {
			content += "\n## Hidden Words\n\n";
			const sortedHidden = [...hiddenWords].sort();
			sortedHidden.forEach(word => {
				content += `- ${word}\n`;
			});
		}

		const timestamp = new Date().toISOString().slice(0, 10);
		const filename = `Word Frequency - ${timestamp}.md`;

		try {
			const existingFile = this.app.vault.getAbstractFileByPath(filename);
			if (existingFile) {
				new Notice(`Note "${filename}" already exists. Overwriting.`);
				await this.app.vault.modify(existingFile as TFile, content);
			} else {
				const newFile = await this.app.vault.create(filename, content);
				new Notice(`Word frequency list saved to "${filename}".`);
			}
		} catch (error) {
			console.error("Error saving word frequency list:", error);
			new Notice("Failed to save word frequency list. Check console for details.");
		}
	}
}

class WordNotesView extends ItemView {
  vault: Vault;
  plugin: WordFrequencyPlugin;
  selectedWord: string = "";
  filesWithWord: TFile[] = [];
  sortBy: 'path' | 'created' = 'path';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(leaf: WorkspaceLeaf, vault: Vault, plugin: WordFrequencyPlugin) {
    super(leaf);
    this.vault = vault;
    this.plugin = plugin;
  }

  async setState(state: any, result: ViewStateResult): Promise<void> {
    this.selectedWord = state.word || "";
    this.sortBy = state.sortBy || 'path';
    this.sortOrder = state.sortOrder || 'asc';
    await super.setState(state, result);
    await this.renderView();
  }

  getState() {
    return { word: this.selectedWord, sortBy: this.sortBy, sortOrder: this.sortOrder };
  }

  getViewType(): string { return VIEW_TYPE_WORD_NOTES; }
  getDisplayText(): string { return this.selectedWord || "Word Notes"; }

  async onOpen() {
    // Initial rendering is now handled by setState calling renderView
  }

  async renderView() {
    const container = this.contentEl;
    container.empty();

    if (!this.selectedWord) {
      container.createEl("p", { text: "No word selected."});
      return;
    }

    const headerDiv = container.createEl("div", { cls: "word-notes-header" });
    const backBtn = headerDiv.createEl("button", { cls: "word-notes-back-button", text: "←", title: "Back to frequency list" });
    backBtn.onclick = async () => { await this.plugin.activateView(); };
    headerDiv.createEl("h2", { text: this.selectedWord });

    // --- Sort Controls ---
    const sortControlContainer = container.createDiv({ cls: "word-notes-sort-controls" });
    sortControlContainer.style.marginBottom = "1em";
    sortControlContainer.style.display = "flex";
    sortControlContainer.style.gap = "0.5em";

    const sortByNameButton = sortControlContainer.createEl('button');
    sortByNameButton.setText(`Sort by Name (${this.sortBy === 'path' ? (this.sortOrder === 'asc' ? 'A-Z' : 'Z-A') : 'A-Z'})`);
    sortByNameButton.title = "Sort by file path";
    sortByNameButton.onclick = async () => {
      if (this.sortBy === 'path') {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = 'path';
        this.sortOrder = 'asc';
      }
      await this.renderView();
    };

    const sortByCreatedButton = sortControlContainer.createEl('button');
    sortByCreatedButton.setText(`Sort by Created (${this.sortBy === 'created' ? (this.sortOrder === 'asc' ? 'Oldest' : 'Newest') : 'Oldest'})`);
    sortByCreatedButton.title = "Sort by file creation time";
    sortByCreatedButton.onclick = async () => {
      if (this.sortBy === 'created') {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = 'created';
        this.sortOrder = 'asc';
      }
      await this.renderView();
    };

    // Add the Create Note button here, next to sort controls, aligned right
    const createNoteButton = sortControlContainer.createEl('button', {
      cls: 'word-notes-create-list-button', // Use new CSS class, remove mod-cta
      attr: { style: 'margin-left: auto;' }, // Align to the right within the flex container
      title: 'Create note from list' // Tooltip
    });
    setIcon(createNoteButton, 'list-plus'); // Set icon using Obsidian's function
    createNoteButton.addEventListener('click', () => this.createWordListNote()); // Use arrow function for 'this' context

    // --- Highlight active sort button ---
    if (this.sortBy === 'path') {
      sortByNameButton.style.backgroundColor = 'var(--background-modifier-hover)';
    } else if (this.sortBy === 'created') {
      sortByCreatedButton.style.backgroundColor = 'var(--background-modifier-hover)';
    }
    // --- End Highlight ---

    const loadingEl = container.createEl("p", {text: "Searching notes..."});

    this.filesWithWord = await this.computeFilesWithWord();
    loadingEl.remove();

    if (this.filesWithWord.length === 0) {
      container.createEl("p", { text: `No notes found containing "${this.selectedWord}".` });
    } else {
      // --- Sort the files before rendering ---
      this.sortFiles();
      // --- End Sort ---

      const listEl = container.createEl("ul", { cls: "word-notes-list" });
      this.filesWithWord.forEach(file => {
        const li = listEl.createEl("li");
        li.innerText = file.path;
        li.onclick = async () => {
          await this.plugin.app.workspace.openLinkText(file.path, '', false);
        };
      });
    }
  }

  async computeFilesWithWord(): Promise<TFile[]> {
    if (!this.selectedWord) return [];

    const results: TFile[] = [];
    const allFiles = this.vault.getMarkdownFiles();
    const wordRegex = new RegExp(`\\b${this.selectedWord}\\b`, 'i');

    for (const file of allFiles) {
      try {
        const content = await this.vault.cachedRead(file);
        if (content.match(wordRegex)) {
          results.push(file);
        }
      } catch (e) {
        console.error(`Word Frequency Plugin: Error reading file ${file.path}:`, e);
      }
    }
    return results.sort((a, b) => a.path.localeCompare(b.path));
  }

  sortFiles() {
    this.filesWithWord.sort((a, b) => {
      let comparison = 0;
      if (this.sortBy === 'path') {
        comparison = a.path.localeCompare(b.path);
      } else if (this.sortBy === 'created') {
        comparison = a.stat.ctime - b.stat.ctime;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  async createWordListNote() {
    if (!this.selectedWord || !this.filesWithWord || this.filesWithWord.length === 0) {
      new Notice("No word selected or no files to list.");
      return;
    }

    const title = `Word List - ${this.selectedWord}`;
    let content = `# Notes containing "${this.selectedWord}"\n\n`;

    // Use the currently sorted list (this.filesWithWord is already sorted by renderView calling sortFiles)
    this.filesWithWord.forEach(file => {
      // Use file.path to ensure uniqueness if names clash and create a valid link
      content += `- [[${file.path}]]\n`;
    });

    try {
      // Attempt to create the file. Handle potential conflicts.
      const filePath = `${title}.md`;
      let fileToCreate = filePath;
      let counter = 1;
      // Check if file already exists and append a number if needed
      while (await this.app.vault.adapter.exists(fileToCreate)) {
          fileToCreate = `${title} ${counter++}.md`;
      }

      const newFile = await this.app.vault.create(
        fileToCreate,
        content
      );
      new Notice(`Created note: ${newFile.basename}`);
      // Optional: Open the newly created note
      // this.app.workspace.getLeaf(true).openFile(newFile);
    } catch (error) {
      console.error("Error creating word list note:", error);
      new Notice("Error creating note. File might already exist or invalid characters in title.");
    }
  }
}
