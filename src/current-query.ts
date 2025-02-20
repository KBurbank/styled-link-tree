import { getAPI, DataviewApi} from 'obsidian-dataview'
import { MarkdownView, Component, App } from 'obsidian'
import  FoldableList  from './main'

const dv: DataviewApi = getAPI() 
//let obsidianApp = getObsidianAPI()


interface DisplayInfo {
headings ?: Array<string>,
displayFunction : string,
displayType ?: string,
sortOrder ?: number,
headerText : string
}

interface Settings {
  identifier: string,
  filetypes: Object
}


class displayInfo {
  public values:DisplayInfo

defaultValues: DisplayInfo = {
    headings: ["Name", "Created"],
    displayFunction: "myRows => myRows.map(k => [k.file.link, dv.func.dateformat(k.file.ctime,'MMM dd, yyyy')])",
    displayType: 'table',
    sortOrder: 6,
    headerText: ""
  }


  constructor(XOptions?: DisplayInfo) {
    
    this.values={ ...this.defaultValues, ...XOptions }
  }

  public setValuesFromSettings(settings,key){
    this.values.headerText=key
    if (key in settings){
      this.values={...this.defaultValues, ...settings[key]}
  }
}
}

// Utility function to figure out how to order the tables that are created
const sortOrder = (state, settings) => {
  if(state in settings) return settings[state].sortOrder
  else return 1
}


// Render a single dataview table or list, using parameters described in the settings file
async function render(group,toDisplayJSON: Object,container: HTMLElement,component: Component,filepath: String){
  var safeObj = new displayInfo()
  safeObj.setValuesFromSettings(toDisplayJSON,group.key)
  
  const displayFunction = eval(safeObj.values.displayFunction)
  if (safeObj.values.displayType !== "hide"){
  let newel = container.createEl("details")
  newel.setAttribute("open", "")
 // newel.setCssStyles("h4")
 let summaryEl = newel.createEl("summary")
 summaryEl.setAttr("style","color:grey")
 summaryEl.setAttr("class","summary-class")
  let titleEl = summaryEl.createEl("span")
  titleEl.innerHTML=safeObj.values.headerText
  titleEl.setAttr("class","HyperMD-header HyperMD-header-2 cm-header cm-header-2 summary-title-class")
  switch (safeObj.values.displayType) {
    case 'list':{
      dv.list(displayFunction(group.rows),newel, component,filepath);
      component.load();
      
      return
    }
   
    default: { 
     
      await dv.table(safeObj.values.headings, displayFunction(group.rows),newel, component,filepath); 
      component.load();

      return
    }
  } 

    } else return
  }
  
  export async function currentquery(container: HTMLElement,component: Component,filepath: String, plugin: FoldableList){
    const currentFile = app.workspace.getActiveViewOfType(MarkdownView)?.file?.path.replace('.md','')    
    
    
    // Parse arguments to decide which file to look for inlinks about and see which json file to use for settings (default "data.json")
    // var theFile =   "test.md"
    var settingsFile = "sorted_backlinks_settings.json"
    const filetypes = JSON.parse(plugin.settings.filetypes)
    const identifier = plugin.settings.identifier
    var thePages = dv.pages("[["+currentFile+"]] or outgoing([["+currentFile+"]])")
   // plugin.loadSettings()
   
    // Read the settings JSON file
    
   // const settings = await readSettings(settingsFile)
    //console.log(settings)
    
    // Actually rendering the output
    var output = ""
    for (let group of thePages.groupBy(p => p[identifier]).sort(p=>sortOrder(p.key,filetypes)))
    { 
      if (group === undefined){
        console.log("group is undefined")
        output += "\n"
      } else {
        await render(group,filetypes,container,component,filepath)
        //console.log(output)
      }
    }
    
    return(output)
  }
  