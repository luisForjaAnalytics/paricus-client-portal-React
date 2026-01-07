import { Avatar, Box } from "@mui/material";
import { TicketText } from "../TicketText";
import { getInitials } from "../../../utils/getInitials";
import { colors } from "../../../styles/styles";

export const GetInitialsAvatar = ({ userName, variantStyle }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          color: colors.primary,
          bgcolor: colors.financialClientAvatar,
          fontSize: "0.875rem",
          fontWeight: "bold",
        }}
      >
        {getInitials(userName)}
      </Avatar>
      <TicketText variant={variantStyle}>{`${userName} `}</TicketText>
    </Box>
  );
};
