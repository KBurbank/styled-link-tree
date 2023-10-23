import { DEFAULT_SETTINGS }  from "./main";
import FoldableList from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";


export type FoldableListSettings = {
    identifier: string;
    filetypes: string
  }




export class ExampleSettingTab extends PluginSettingTab {
  plugin: FoldableList;

  constructor(app: App, plugin: FoldableList) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Identifier")
      .setDesc("Page Kind Identifier")
      .addText((text) =>
        text
          .setPlaceholder("type")
          .setValue(this.plugin.settings.identifier)
          .onChange(async (value) => {
            this.plugin.settings.identifier = value;
            await this.plugin.saveSettings();
          })
      );
      new Setting(containerEl)
      .setName("File Types")
      .setDesc("JSON formatted list")
      .addTextArea((text) =>
        text
          .setValue(DEFAULT_SETTINGS.filetypes)
          .setValue(this.plugin.settings.filetypes)
          .onChange(async (value) => {
            this.plugin.settings.filetypes = value;
            await this.plugin.saveSettings();
          })
          .inputEl.setAttrs({"rows":"20","cols":100})
      );
  }
}