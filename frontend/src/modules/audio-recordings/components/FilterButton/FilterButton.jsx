import { IconButton, Tooltip } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../common/styles/styles";

export const FilterButton = ({ folderName, isOpen, setIsOpen }) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t(`${folderName}`)}>
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        size="medium"
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
