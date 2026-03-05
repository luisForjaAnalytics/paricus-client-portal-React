import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import { colors } from "../../../styles/styles";

const SVG_GRADIENT_ID = "loading-progress-gradient";

function GradientSvgDef() {
  return (
    <svg width={0} height={0}>
      <defs>
        <linearGradient id={SVG_GRADIENT_ID} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.gradientStart} />
          <stop offset="100%" stopColor={colors.gradientEnd} />
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

LoadingProgress.propTypes = {
  size: PropTypes.number,
  sx: PropTypes.object,
};
