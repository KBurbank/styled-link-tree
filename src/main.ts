import { Notice, Plugin } from 'obsidian'
import { getAPI } from 'obsidian-dataview'
import SortedBacklinksView from './SortedBacklinksView'

type FoldableListSettings = {}
const DEFAULT_SETTINGS: FoldableListSettings = {}
export const SORTED_BACKLINKS_VIEW = 'sorted-backlinks'

export default class FoldableList extends Plugin {
  settings: FoldableListSettings

  async onload() {
    const dv = getAPI()
    if (!dv) {
      new Notice('Please install Dataview to use Sorted Backlinks')
      return
    }

    this.registerView(SORTED_BACKLINKS_VIEW, (leaf) => new SortedBacklinksView(leaf))

    this.addCommand({
      icon: 'list-tree',
      callback: () => this.activateView(),
      id: 'activate-view',
      name: 'View Sorted Backlinks',
    })

    this.addRibbonIcon('list-tree', 'Sorted Backlinks', () => this.activateView())

    await this.loadSettings()
  }

  async loadSettings() {
    this.settings = Object.assign(DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }

  async getDataView() {
    let dataViewPlugin = getAPI(this.app)
    if (!dataViewPlugin) {
      // wait for Dataview plugin to load (usually <100ms)
      dataViewPlugin = await new Promise((resolve) => {
        setTimeout(() => resolve(getAPI(this.app)), 350)
      })
      if (!dataViewPlugin) {
        new Notice('Please enable the DataView plugin for Link Tree to work.')
        this.app.workspace.detachLeavesOfType(SORTED_BACKLINKS_VIEW)
        throw new Error('no Dataview')
      }
    }
  }

  async activateView() {
    await this.getDataView()
    const leaf =
      this.app.workspace.getLeavesOfType(SORTED_BACKLINKS_VIEW)?.[0] ??
      this.app.workspace.getRightLeaf(false)

    await leaf.setViewState({
      type: SORTED_BACKLINKS_VIEW,
      active: true,
    })
   
    this.app.workspace.revealLeaf(leaf)
  }
}
