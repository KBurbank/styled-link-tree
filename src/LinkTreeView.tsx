import { App, ItemView, MarkdownView, MarkdownEditView, WorkspaceLeaf, MarkdownRenderer, MarkdownRenderChild } from 'obsidian'
import { currentquery } from 'current-query'


export default class LinkTreeView extends ItemView {
  

  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
    this.leaf = leaf
    this.icon = 'list-tree'
    this.navigation = false
    
   // this.obsidianAPI = new ObsidianAPI(this.app)
   // this.dv = getAPI()
  //  getStore('setState')({ obsidianAPI: this.obsidianAPI })
  }

  getDisplayText(): string {
    return 'Styled Link Tree'
  }

  getViewType(): string {
    return 'styled-link-tree'
  }

  handleClick(event: MouseEvent) {
    const targetEl = event.target as HTMLElement;
    const closestAnchor =
      targetEl.tagName === "A" ? targetEl : targetEl.closest("a");

    if (!closestAnchor) {
      return;
    }

    event.stopPropagation();

    if (closestAnchor.hasClass("internal-link")) {
      event.preventDefault();

      const href = closestAnchor.getAttr("href");
      const newLeaf = event.button === 1 || event.ctrlKey || event.metaKey;

      if (href) {
        app.workspace.openLinkText(href, "/", newLeaf);
      }
    }
  }

async updateLeaf(): Promise<void> {
  const output = await currentquery()
   //console.log(this)
   let markdownRenderChild = new MarkdownRenderChild(this.containerEl);
   markdownRenderChild.containerEl = this.containerEl;
   this.containerEl.innerHTML=""
   //this.containerEl.onClickEvent()
   var newel = this.containerEl.createDiv("")
  
   //newel.addClass("markdown-source-view cm-s-obsidian mod-cm6 is-folding is-live-preview show-properties is-readable-line-width node-insert-event")
   var newel2 = newel.createDiv("myDiv")
   this.containerEl.setCssProps({"overflow":"auto"})
   
//   newel3.onClickEvent((e:any) => app.workspace.openLinkText( newel3.getAttr("data-href"),"/"))
   newel.onClickEvent((e:any) => this.handleClick(e))
  
  // newel3.onclick="do something"
   //newel2.setAttr("pointer-event","fill")
   console.log(output)
   await MarkdownRenderer.renderMarkdown(output, newel2,"/",markdownRenderChild)
  
 //  console.log(output)
}

  
  async onOpen() {

    this.registerEvent(
      this.app.workspace.on('active-leaf-change', (leaf) => {
        if (leaf?.getViewState()?.type === 'markdown' )
           this.updateLeaf()
      })
    )

   await this.updateLeaf()

  //
  //  const container = this.containerEl;
   // container.empty();
  // this.app.workspace.getActiveFile()
   // await currentquery()

    
  }

  async onClose() {
 //   this.root.unmount()
  }
}
