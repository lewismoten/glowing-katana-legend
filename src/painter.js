(function main() {

  'use strict';

  var $canvas,
    zoomCanvas,
    actualCanvas,
    bitmapWidth = 8,
    bitmapHeight = 8,
    bitmapZoom = 10,
    penColorWhite = true,
    penColorBlack = false,
    penColor = penColorBlack,
    bitmap = [],
    isDrawing,
    name = 'demoImage';

  $(document).ready(onDocumentReady);

function showValues() {

  $('#widthLabel').text(bitmapWidth);
  $('#imageWidth').val(bitmapWidth);
  $('#heightLabel').text(bitmapHeight);
  $('#imageHeight').val(bitmapHeight);
  $('#zoomLabel').text(bitmapZoom);
  $('#imageZoom').val(bitmapZoom);
  $('#inoFileName').text(name);
  $('#cppFileName').text(name);
  $('#hFileName').text(name);
  $('#imageName').val(name);

}

function onDocumentReady() {

  $canvas = $('#zoomCanvas');
  zoomCanvas = document.getElementById('zoomCanvas');
  actualCanvas = document.getElementById('actualCanvas');
//  context = canvas.getContext('2d');

  $('#imageWidth').change(onChangeWidth);
  $('#imageWidth').mousemove(onChangeWidth);
  $('#imageHeight').change(onChangeHeight);
  $('#imageHeight').mousemove(onChangeHeight);
  $('#imageZoom').change(onChangeZoom);
  $('#imageZoom').mousemove(onChangeZoom);
  $('#imageName').change(onChangeName);
  $('#imageName').keypress(onChangeName);
  $('#imageName').keyup(onChangeName);
  $('#filePicker').change(onPickFile);

  $canvas.contextmenu(doNothing);
  $canvas.mousedown(onPendDown);
  $canvas.mousemove(onPenMove);
  $canvas.mouseup(onPenUp);
  $canvas.mouseleave(onPenUp);

  resize();
  redraw();

}

function onPickFile() {

  var files = document.getElementById('filePicker').files,
    reader = new FileReader();

  if (typeof files === 'undefined' || files.length <= 0) {

    console.log('no image...');
    return;

  }

  reader.onloadend = function onFileLoaded() {

    var image = new Image(),
      x,
      y,
      context = actualCanvas.getContext('2d'),
      rgba;

    image.onload = function onImageLoaded() {

      bitmapWidth = image.width;
      bitmapHeight = image.height;
      context.canvas.width = bitmapWidth;
      context.canvas.height = bitmapHeight;
      resize();

      context.drawImage(image, 0, 0);

      // now read our pixels
      for (x = 0; x < bitmapWidth; x++) {

        for (y = 0; y < bitmapHeight; y++) {

          rgba = context.getImageData(x, y, 1, 1).data;

          // let's make assumptions!
          bitmap[x][y] = rgba[0] === 0xff;

        }

      }

      redraw();

    };
    image.src = reader.result;

  };

  reader.readAsDataURL(files[0]);

}

function onChangeName() {

  name = $('#imageName').val();
  showValues();

}

function onChangeWidth() {

  bitmapWidth = $('#imageWidth').val();
  resize();
  redraw();

}

function onChangeHeight() {

  bitmapHeight = $('#imageHeight').val();
  resize();
  redraw();

}

function onChangeZoom() {

  bitmapZoom = $('#imageZoom').val();
  resize();
  redraw();
}

function resize() {

  // This is setup to preserve existing pixels
  var x;

  if (bitmap.length < bitmapWidth) {

    for (x = bitmap.length; x < bitmapWidth; x++) {

      bitmap[x] = [];

    }

  }

}

function markCell(e) {

  var x = e.pageX - this.offsetLeft,
    y = e.pageY - this.offsetTop;

    x = Math.floor(x / bitmapZoom);
    y = Math.floor(y / bitmapZoom);

    isDrawing = true;
    plot(x, y);

}

function onPendDown(e) {

  penColor = e.button === 0 ? penColorWhite : penColorBlack;
  markCell.call(this, e);

}

function onPenMove(e) {

  if (isDrawing) {

    markCell.call(this, e);

  }

}

function onPenUp() {

  isDrawing = false;

}

function plot(x, y) {

  if (bitmap[x][y] !== penColor) {

    bitmap[x][y] = penColor;
    redraw();

  }

}

function getCellChunkValue(cellChunk) {

  var byte = 0,
    i,
    pad = '';

  for (i = 0; i < 8; i++) {

    if (cellChunk[i] === penColorWhite) {

      byte |= 1 << i;

    }

  }

  if (byte < 16) {

    pad = '0';

  }

  return '0x' + pad + byte.toString(16);

}

function redraw() {

  showValues();
  draw();

  var data = actualCanvas.toDataURL('image/png');
  $('#download').attr('href', data);
  $('#download').attr('download', name + '.png');
  $('#download').text(name + '.png');

  generateCpp();
  generateInoFile();
  generateHeaderFile();

}

function draw() {

  var on,
    x,
    y,
    white = '#ffffff',
    black = '#000000',
    context = actualCanvas.getContext('2d'),
    zoomContext;

    context.canvas.width = bitmapWidth;
    context.canvas.height = bitmapHeight;

  for (x = 0; x < bitmapWidth; x++) {

    for (y = 0; y < bitmapHeight; y++) {

      on = bitmap[x][y];
      context.fillStyle = on ? white : black;
      context.fillRect(x, y, 1, 1);

    }

  }

  // copy to zoomed in area...
  zoomContext = zoomCanvas.getContext('2d');
  zoomContext.canvas.width = bitmapWidth * bitmapZoom;
  zoomContext.canvas.height = bitmapHeight * bitmapZoom;
  zoomContext.imageSmoothingEnabled = false;
  zoomContext.drawImage(actualCanvas, 0, 0, bitmapWidth * bitmapZoom, bitmapHeight * bitmapZoom);
}

function generateCpp() {


    // get the code!
    var lines = [],
      line,
      buffer,
      bytes = [],
      offset,
      y,
      x;

    // Go through each 'row', 8 pixels high
    for (y = 0; y < bitmapHeight; y += 8) {

      // Go through each column
      for (x = 0; x < bitmapWidth; x++) {

        // get 8 vertical cells in the current row/column
        buffer = bitmap[x].slice(y, y + 8);
        bytes.push(getCellChunkValue(buffer));

      }

    }

    lines.push('#include "' + name + '.h"');
    lines.push('#include "Arduboy.h"');
    lines.push('');
    lines.push('const unsigned PROGMEM char ' + name + '[] = {');

    for (offset = 0; offset < bytes.length; offset += 8) {

      line = bytes.slice(offset, offset + 8).join(', ');
      if (offset + 8 < bytes.length) {

        line += ',';

      }

      lines.push('  ' + line);

    }

    lines.push('};');

    $('#cppFile').val(lines.join('\n'));

}

function generateInoFile() {

  var lines = [],
    size = [bitmapWidth, bitmapHeight].join(', ');

  lines.push('#include "Arduboy.h"');
  lines.push('#include "' + name + '.h"');
  lines.push('');
  lines.push('Arduboy arduboy;');
  lines.push('');
  lines.push('void setup() {');
  lines.push('  arduboy.begin();');
  lines.push('  arduboy.clear();');
  lines.push('  arduboy.drawBitmap(0, 0, ' + name + ', ' + size + ', WHITE);');
  lines.push('  arduboy.display();');
  lines.push('}');
  lines.push('');
  lines.push('void loop() {}');


  $('#inoFile').val(lines.join('\n'));

}

function generateHeaderFile() {

  var lines = [],
    NAME = name.toUpperCase();

  lines.push('#ifndef ' + NAME + '_H');
  lines.push('#define ' + NAME + '_H');
  lines.push('');
  lines.push('extern const unsigned char ' + name + '[];');
  lines.push('');
  lines.push('#endif');

  $('#hFile').val(lines.join('\n'));

}


  function doNothing(e) {

    e.preventDefault();

  }

}());
