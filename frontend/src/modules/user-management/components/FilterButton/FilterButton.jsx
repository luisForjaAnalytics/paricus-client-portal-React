import { IconButton, Tooltip } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { colors } from "../../../../common/styles/styles";

export const FilterButton = ({ folderName, isOpen, setIsOpen }) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t(`${folderName}`)}>
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        size="small"
        sx={{
          backgroundColor: colors?.backgroundOpenSubSection,
          width: "2.5rem",
        }}
      >
        <FilterList fontSize="medium" />
      </IconButton>
    </Tooltip>
  );
};

FilterButton.propTypes = {
  folderName: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};
