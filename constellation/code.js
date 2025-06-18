figma.showUI(__html__, { width: 320, height: 400 });

// Function to get frame URL
function getFrameUrl(node) {
  if (node.type === 'FRAME') {
    const fileKey = figma.fileKey;
    return `https://www.figma.com/file/${fileKey}?node-id=${node.id}`;
  }
  return null;
}

// Function to capture frame screenshot
async function captureFrameScreenshot(frame) {
  try {
    // Export the frame as PNG with specific settings
    const image = await frame.exportAsync({
      format: 'PNG',
      constraint: {
        type: 'SCALE',
        value: 1 // 1x scale for reasonable file size
      }
    });
    
    // Convert Uint8Array to base64
    const base64 = figma.base64Encode(image);
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  }
}

// Function to handle selection changes
async function handleSelectionChange() {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.ui.postMessage({
      type: 'selection-changed',
      frameUrl: null,
      frameName: null,
      screenshot: null,
      message: 'Select a frame to view its URL and screenshot'
    });
    return;
  }

  // Check if any selected item is a frame
  const frames = selection.filter(node => node.type === 'FRAME');
  
  if (frames.length === 0) {
    figma.ui.postMessage({
      type: 'selection-changed',
      frameUrl: null,
      frameName: null,
      screenshot: null,
      message: 'Please select a frame to view its URL and screenshot'
    });
    return;
  }

  // Show loading state
  figma.ui.postMessage({
    type: 'loading',
    message: 'Capturing screenshot...'
  });

  // If multiple frames selected, show the first one
  const frame = frames[0];
  const frameUrl = getFrameUrl(frame);
  
  // Capture screenshot
  const screenshot = await captureFrameScreenshot(frame);
  
  figma.ui.postMessage({
    type: 'selection-changed',
    frameUrl: frameUrl,
    frameName: frame.name,
    screenshot: screenshot,
    frameWidth: frame.width,
    frameHeight: frame.height,
    message: frames.length > 1 ? `Showing "${frame.name}" (${frames.length} frames selected)` : null
  });
}

// Listen for selection changes
figma.on('selectionchange', handleSelectionChange);

// Handle initial selection
handleSelectionChange();

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'copy-url') {
    console.log('Copy URL requested');
  }
  
  if (msg.type === 'refresh-screenshot') {
    // Re-capture screenshot for current selection
    await handleSelectionChange();
  }
  
  if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }
};
