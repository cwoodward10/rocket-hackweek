import { SendToUi } from "@common/Messages";

figma.showUI(__html__);

figma.on('selectionchange', () => {
  SendToUi('SelectionChanged', figma.currentPage.selection);
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