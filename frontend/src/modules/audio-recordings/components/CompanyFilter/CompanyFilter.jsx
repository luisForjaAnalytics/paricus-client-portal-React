import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {ToolbarButton } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import FilterListIcon from "@mui/icons-material/FilterList";
import { colors } from "../../../../common/styles/styles";


export const CompanyFilter = ({setCompanyFilter, filters, companies}) => {
  return (
             <Box sx={{ display: "flex", gap: 2, alignItems: "center", marginBottom:1 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="company-filter-label">Company</InputLabel>
              <Select
                labelId="company-filter-label"
                value={filters.company || ""}
                onChange={(e) => setCompanyFilter(e.target.value || null)}
                label="Company"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary,
                  },
                }}
              >
                <MenuItem value="">
                  <em>All Companies</em>
                </MenuItem>
                {companies.map((company, index) => (
                  <MenuItem key={index} value={company.name}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tooltip title="Filters" sx={{ marginRight: "1rem" }}>
              <ToolbarButton onClick={() => setIsOpen(!isOpen)}>
                <FilterListIcon fontSize="small" />
              </ToolbarButton>
            </Tooltip>
          </Box>
  )
}
