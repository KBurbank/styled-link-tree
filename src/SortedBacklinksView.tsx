import { ItemView, WorkspaceLeaf,MarkdownRenderChild } from 'obsidian'
import { currentquery } from 'current-query'


export default class SortedBacklinksView extends ItemView {
  
  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
    this.leaf = leaf
    this.icon = 'list-tree'
    this.navigation = false
    
  }

  getDisplayText(): string {
    return 'Sorted Backlinks'
  }

  getViewType(): string {
    return 'sorted-backlinks'
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
 
   //console.log(this)
   let markdownRenderChild = new MarkdownRenderChild(this.containerEl);
   markdownRenderChild.containerEl = this.containerEl;
   this.containerEl.innerHTML=""
   //this.containerEl.onClickEvent()
   var newel = this.containerEl.createDiv("markdown-preview-view")

   var newel2 = newel.createDiv("myDiv")
   this.containerEl.setCssProps({"overflow":"auto"})

   newel.onClickEvent((e:any) => this.handleClick(e))
  await currentquery(newel2,markdownRenderChild,"/")
   //await MarkdownRenderer.renderMarkdown(output, newel2,"/",markdownRenderChild)
   
}

  
  async onOpen() {

    this.registerEvent(
      this.app.workspace.on('active-leaf-change', (leaf) => {
        if (leaf?.getViewState()?.type === 'markdown' )
           this.updateLeaf()
      })
    )

   await this.updateLeaf()
    
  }

  async onClose() {
  }
}
