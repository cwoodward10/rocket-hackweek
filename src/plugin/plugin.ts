import { type PluginMessage, SendToUi } from "@ common/messages";
import { HandleSumbit } from "./handlers/submit";

figma.showUI(__html__);

figma.on('selectionchange', () => {
  PostToUi('SelectionChanged', figma.currentPage.selection);
})

figma.ui.on("message", (msg: ) => {
  if (msg === "close") {
    figma.closePlugin();
    return;
  }

  switch (msg.message) {
    case "submit": 
      HandleSumbit(msg.data);
      break;
  }
});