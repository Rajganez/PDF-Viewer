const zoomButton = document.getElementById("zoom");
const input = document.getElementById("inputFile");
const openFile = document.getElementById("openPDF");
const currentPage = document.getElementById("current_page");
const viewer = document.querySelector(".pdf-viewer");
let currentPDF = {};
// Current object to set the pdf file, and pages and zoom options
function resetCurrentPDF() {
  currentPDF = {
    file: null,
    countOfPages: 0,
    currentPage: 1,
    zoom: 1.5,
  };
}
// onClick input element is triggered to open the local folder to Upload files
openFile.addEventListener("click", () => {
  input.click();
});
// Event handler for the onChange file uploader function
input.addEventListener("change", (event) => {
  const inputFile = event.target.files[0];
  if (inputFile.type == "application/pdf") {
    const reader = new FileReader();
    reader.readAsDataURL(inputFile);
    reader.onload = () => {
      loadPDF(reader.result);
      zoomButton.disabled = false;
    };
  } else {
    alert("The file you are trying to open is not a pdf file!");
  }
});

// Event handler function for zoom button
zoomButton.addEventListener("input", () => {
  if (currentPDF.file) {
    document.getElementById("zoomValue").innerHTML = zoomButton.value + "%";
    currentPDF.zoom = parseInt(zoomButton.value) / 100;
    renderCurrentPage();
  }
});

// Event handlers for the next and previous buttons
document.getElementById("next").addEventListener("click", () => {
  const isValidPage = currentPDF.currentPage < currentPDF.countOfPages;
  if (isValidPage) {
    currentPDF.currentPage += 1;
    renderCurrentPage();
  }
});
document.getElementById("previous").addEventListener("click", () => {
  const isValidPage = currentPDF.currentPage - 1 > 0;
  if (isValidPage) {
    currentPDF.currentPage -= 1;
    renderCurrentPage();
  }
});
// Function to set the PDF file in the PDF.js and Data is stored in the current PDF Object
function loadPDF(data) {
  // Specify the worker source to prevent the deprecated warning
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js";
  const pdfFile = pdfjsLib.getDocument(data);
  resetCurrentPDF();
  pdfFile.promise.then((doc) => {
    currentPDF.file = doc;
    currentPDF.countOfPages = doc.numPages;
    viewer.classList.remove("hidden");
    document.querySelector("main h3").classList.add("hidden");
    renderCurrentPage();
  });
}

// Function to render the current page of the PDF and the page is displayed
function renderCurrentPage() {
  currentPDF.file.getPage(currentPDF.currentPage).then((page) => {
    let context = viewer.getContext("2d");
    let viewport = page.getViewport({ scale: currentPDF.zoom });
    viewer.height = viewport.height;
    viewer.width = viewport.width;

    let renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    page.render(renderContext);
  });
  currentPage.innerHTML =
    currentPDF.currentPage + " of " + currentPDF.countOfPages;
}
