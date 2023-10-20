import { getAPI} from 'obsidian-dataview'
import { MarkdownView } from 'obsidian'

const dv = getAPI()
//let obsidianApp = getObsidianAPI()


const defaultValues = {
  'headings': ["Name", "Created"],
  'displayFunction':  myRows => myRows.map(k => [k.file.link, dv.func.dateformat(k.file.ctime,"MMM dd, yyyy")]),
  'displayType': 'table',
  'sortOrder': 4
}



// Utility function to figure out how to order the tables that are created
const sortOrder = (state, settings) => {
  if(state in settings) return settings[state].sortOrder
  else return 1
}

async function readSettings( settingsFile: String){
  const myString = await dv.io.load(settingsFile) 
  return(JSON.parse(myString))
}

// Render a single dataview table or list, using parameters described in the settings file
async function render(group,toDisplayJSON,defaultValues,container,component,filepath){
  var output = "<details>"
  var safeObj = {...defaultValues}
  safeObj.headerText = group.key;

  if (group.key in toDisplayJSON){
    safeObj = {...safeObj, ...toDisplayJSON[group.key]}
  }
  const displayFunction = eval(safeObj.displayFunction)
  switch (safeObj.displayType) {
    case 'list':{
      output += "<summary><markdown> ### "+safeObj.headerText + "</markdown></summary>\n<markdown>"
      let newel = container.createEl("details")
      newel.setAttribute("open", "")
      newel.createEl("summary").innerHTML=safeObj.headerText
     // newel.createEl("h3").innerHTML=safeObj.headerText
      dv.list(displayFunction(group.rows),newel, component,filepath);
      component.load();
      //output += myQuery
      //     await MarkdownRenderer.render(thisApp,myQuery,listRoot,"test.md",container[1])
      output += "</markdown></details>"
      return(output)
    }
    case 'hide': return("");
    default: { 
      output += "<summary><markdown> ### "+safeObj.headerText + "</markdown></summary>\n<markdown>"
      
      let newel = container.createEl("details")
      newel.setAttribute("open", "")
      newel.createEl("summary").innerHTML=safeObj.headerText
    //  newel.createEl("h3").innerHTML=safeObj.headerText
      await dv.table(safeObj.headings, displayFunction(group.rows),newel, component,filepath); 
      component.load();
     // output = output + myQuery;
      output += "</markdown></details>"
      return(output)
    }


    } 
  }
  
  export async function currentquery(container,component,filepath){
    const currentFile = app.workspace.getActiveViewOfType(MarkdownView)?.file?.path.replace('.md','')    
    
    
    // Parse arguments to decide which file to look for inlinks about and see which json file to use for settings (default "data.json")
    // var theFile =   "test.md"
    var settingsFile = "data.json"
    var thePages = dv.pages("[["+currentFile+"]]")
    
    
    // Read the settings JSON file
    
    const settings = await readSettings(settingsFile)
    //console.log(settings)
    
    // Actually rendering the output
    var output = ""
    for (let group of thePages.groupBy(p => p.type).sort(p=>sortOrder(p.key,settings)))
    { 
      if (group === undefined){
        console.log("group is undefined")
        output += "\n"
      } else {
        await render(group,settings,defaultValues,container,component,filepath)
        //console.log(output)
      }
    }
    
    return(output)
  }
  