import CircularProgress from "@mui/material/CircularProgress";

const SVG_GRADIENT_ID = "loading-progress-gradient";

function GradientSvgDef() {
  return (
    <svg width={0} height={0}>
      <defs>
        <linearGradient id={SVG_GRADIENT_ID} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1fb467ec" />
          <stop offset="100%" stopColor="#0a6a38c7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const LoadingProgress = ({ size = 40, sx }) => {
  return (
    <>
      <GradientSvgDef />
      <CircularProgress
        size={size}
        sx={{
          "svg circle": { stroke: `url(#${SVG_GRADIENT_ID})` },
          ...sx,
        }}
      />
    </>
  );
};
