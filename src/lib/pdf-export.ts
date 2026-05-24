import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalHeight > 0) {
            resolve();
            return;
          }
          const finish = () => resolve();
          img.addEventListener("load", finish, { once: true });
          img.addEventListener("error", finish, { once: true });
          const src = img.getAttribute("src");
          if (src && !img.complete) {
            img.src = src;
          }
        })
    )
  ).then(() => undefined);
}

function stash(el: HTMLElement) {
  return {
    position: el.style.position,
    left: el.style.left,
    top: el.style.top,
    width: el.style.width,
    maxWidth: el.style.maxWidth,
    zIndex: el.style.zIndex,
    opacity: el.style.opacity,
    visibility: el.style.visibility,
    pointerEvents: el.style.pointerEvents,
    overflow: el.style.overflow,
    transform: el.style.transform,
  };
}

function restore(el: HTMLElement, saved: ReturnType<typeof stash>) {
  Object.assign(el.style, saved);
}

/** Move printable node into viewport briefly so html2canvas can capture it */
function prepareCaptureTarget(element: HTMLElement) {
  const parent = element.parentElement;
  const savedElement = stash(element);
  const savedParent = parent ? stash(parent) : null;

  if (parent) {
    parent.style.position = "fixed";
    parent.style.left = "0";
    parent.style.top = "0";
    parent.style.width = "794px";
    parent.style.maxWidth = "794px";
    parent.style.zIndex = "2147483646";
    parent.style.opacity = "1";
    parent.style.visibility = "visible";
    parent.style.pointerEvents = "none";
    parent.style.overflow = "visible";
    parent.style.transform = "none";
  }

  element.style.position = "relative";
  element.style.left = "0";
  element.style.top = "0";
  element.style.opacity = "1";
  element.style.visibility = "visible";
  element.style.transform = "none";

  return () => {
    restore(element, savedElement);
    if (parent && savedParent) restore(parent, savedParent);
  };
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Export element to A4 PDF — works on mobile and desktop */
export async function exportElementToPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const cleanup = prepareCaptureTarget(element);

  try {
    await waitForImages(element);
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    const width = Math.max(element.scrollWidth, element.offsetWidth, 794);
    const height = Math.max(element.scrollHeight, element.offsetHeight, 1);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      imageTimeout: 30000,
      width,
      height,
      scrollX: 0,
      scrollY: 0,
      windowWidth: width,
      windowHeight: height,
      onclone: (_doc, cloned) => {
        const node = cloned as HTMLElement;
        node.style.opacity = "1";
        node.style.visibility = "visible";
        node.style.transform = "none";
        node.querySelectorAll("img").forEach((img) => {
          const el = img as HTMLImageElement;
          el.style.opacity = "1";
          el.style.visibility = "visible";
        });
      },
    });

    if (!canvas.width || !canvas.height) {
      throw new Error("PDF capture produced an empty image");
    }

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const blob = pdf.output("blob");
    triggerDownload(blob, filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  } finally {
    cleanup();
  }
}
