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
async function render(group,toDisplayJSON,defaultValues){
  var output = ""
  var safeObj = {...defaultValues}
  safeObj.headerText = group.key;
  if (group.key in toDisplayJSON){
    safeObj = {...safeObj, ...toDisplayJSON[group.key]}
  }
  const displayFunction = eval(safeObj.displayFunction)
   switch (safeObj.displayType) {
    case 'list':{
    output += "#### "+safeObj.headerText + "\n"
    //  container.createEl("h4", "safeObj.headerText");
   //   console.log(safeObj.headerText)
      var myQuery = dv.markdownList(displayFunction(group.rows));
      output += myQuery
 //     await MarkdownRenderer.render(thisApp,myQuery,listRoot,"test.md",container[1])
 return(output)
      break;
    }
    case 'hide': break;
    default: { 

    // table
      
    //  container.createEl("h4", "safeObj.headerText");
    //output += "<h4>"+safeObj.headerText+"</h4>"
    output += "#### "+safeObj.headerText+"\n"
     var myQuery = dv.markdownTable(safeObj.headings, displayFunction(group.rows)); 
     
    //container.createEl("p", { text: "hello world" });
   //dv.executeJs( "dv.list()", "span",  container.createEl("div"), "test.md")
   //var myQuery = await dv.queryMarkdown("LIST from #log")
  
   
   //container.innerHTML = myQuery.value
  output = output + myQuery;
  return(output)
//   await MarkdownRenderer.render(thisApp,myQuery,listRoot,"test.md",container[1])
   // myQuery,listRoot,"test.md",thisApp)
   //dv.executeJs("Something at the root level",listRoot, "test.md", obsidianApp);
//      console.log(container.createEl("p",{text: "safetext"}))
break;}
    // }
    return(output)
  } 
  }
  
export async function currentquery(){
    const currentFile = app.workspace.getActiveViewOfType(MarkdownView)?.file?.path.replace('.md','')    


    // Parse arguments to decide which file to look for inlinks about and see which json file to use for settings (default "data.json")
   // var theFile =   "test.md"
    var settingsFile = "data.json"
    var thePages = dv.pages("[["+currentFile+"]]")
    
    
    // Read the settings JSON file
    
    const settings = await readSettings(settingsFile)
    
   // console.log(thePages)
  
    
    // Actually rendering the output
    var output = ""
    for (let group of thePages.groupBy(p => p.type).sort(p=>sortOrder(p.key,settings)))
    { 
      if (group === undefined){
        console.log("group is undefined")
      } else {
      output += await render(group,settings,defaultValues)
      }
   //   console.log(render(group,settings,defaultValues))
    }

    return(output)
  }
  