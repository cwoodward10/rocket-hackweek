import { type PluginMessage, SendToUi } from "@ common/messages";


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
    case ""
  }
});