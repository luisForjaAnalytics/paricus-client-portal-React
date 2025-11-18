import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useTesseractOCR } from "../../../../common/hooks/useTesseractOCR";
import { useState } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const OcrButton = () => {
  const [file, setFile] = useState(null);
  const { text, progress, loading, error, runOcr } = useTesseractOCR();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) runOcr(file);
  };
  console.log(text)
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload files
      <VisuallyHiddenInput
        type="file"
        onChange={(e) => handleFile(e)}
      />
    </Button>
  );
};

export default OcrButton;
