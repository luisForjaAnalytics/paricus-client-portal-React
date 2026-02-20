import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import {
  Phone,
  PhoneCallback,
  TrendingUp,
  CheckCircle,
  Save,
  RestartAlt,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setAllKpis,
  resetKpis,
  isTargetAchieved,
  defaultKpis,
} from "../../../store/kpi/kpiSlice";
import {
  colors,
  filterStyles,
  primaryIconButton,
  outlinedButton,
} from "../../../common/styles/styles";
import { useNotification } from "../../../common/hooks";
import { AlertInline } from "../../../common/components/ui/AlertInline";
import { useCreateLogMutation } from "../../../store/api/logsApi";

const KPI_CONFIG = [
  {
    key: "callsOffered",
    icon: <Phone />,
    labelKey: "dashboard.statistics.callsOffered",
    isPercent: false,
  },
  {
    key: "callsAnswered",
    icon: <PhoneCallback />,
    labelKey: "dashboard.statistics.callsAnswered",
    isPercent: false,
  },
  {
    key: "answerRate",
    icon: <TrendingUp />,
    labelKey: "dashboard.statistics.answerRate",
    isPercent: true,
  },
  {
    key: "slaCompliance",
    icon: <CheckCircle />,
    labelKey: "dashboard.statistics.slaCompliance",
    isPercent: true,
  },
];

const kpiFieldSchema = z.object({
  value: z.coerce
    .number({ invalid_type_error: "kpiControl.validation.valueNumber" })
    .min(0, "kpiControl.validation.valueMin"),
  target: z.coerce
    .number({ invalid_type_error: "kpiControl.validation.targetNumber" })
    .min(0, "kpiControl.validation.targetMin"),
  change: z.string().min(1, "kpiControl.validation.changeRequired"),
});

const kpiSchema = z.object({
  callsOffered: kpiFieldSchema,
  callsAnswered: kpiFieldSchema,
  answerRate: kpiFieldSchema,
  slaCompliance: kpiFieldSchema,
});

const inputSx = {
  ...filterStyles.inputFilter,
  mt: 0,
  "& .MuiOutlinedInput-root": {
    backgroundColor: colors.surface,
    borderRadius: "0.75rem",
    height: "2.4rem",
    "&.Mui-focused fieldset": { borderColor: colors.focusRing },
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: colors.focusRing,
  },
  "& .MuiInputLabel-root": {
    top: "-0.25rem",
    fontSize: "0.8rem",
    "&.Mui-focused": { color: colors.focusRing },
    "&.MuiInputLabel-shrink": { top: "0" },
  },
};

export const KpiControl = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const kpi = useSelector((state) => state.kpi);
  const user = useSelector((state) => state.auth.user);
  const [createLog] = useCreateLogMutation();
  const { notificationRef, showSuccess, showError } = useNotification();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(kpiSchema),
    mode: "onChange",
    defaultValues: {
      callsOffered: { ...kpi.callsOffered },
      callsAnswered: { ...kpi.callsAnswered },
      answerRate: { ...kpi.answerRate },
      slaCompliance: { ...kpi.slaCompliance },
    },
  });

  const watchedValues = watch();

  const onSubmit = (data) => {
    dispatch(setAllKpis(data));
    showSuccess(t("kpiControl.saveSuccess"));

    createLog({
      userId: user?.id?.toString() || "unknown",
      eventType: "UPDATE",
      entity: "KPI",
      description: `Updated KPI values: Calls Offered=${data.callsOffered.value}, Calls Answered=${data.callsAnswered.value}, Answer Rate=${data.answerRate.value}%, SLA=${data.slaCompliance.value}%`,
      status: "SUCCESS",
    });
  };

  const onError = () => {
    showError(t("kpiControl.saveError"));
  };

  const handleReset = () => {
    dispatch(resetKpis());
    reset({
      callsOffered: { ...defaultKpis.callsOffered },
      callsAnswered: { ...defaultKpis.callsAnswered },
      answerRate: { ...defaultKpis.answerRate },
      slaCompliance: { ...defaultKpis.slaCompliance },
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.surface,
        borderRadius: "1rem",
        border: `1px solid ${colors.border}`,
        width: { xs: "100%", md: "100%", lg: "66%" },
        mx: { xs: 0, md: "auto" },
        my: 3,
        p: 3,
      }}
    >
      {/* KPI Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
          mb: 3,
        }}
      >
        {KPI_CONFIG.map(({ key, icon, labelKey, isPercent }) => {
          const watched = watchedValues[key] ?? {};
          const achieved = isTargetAchieved(watched.value, watched.target);
          const fieldErrors = errors[key] ?? {};
          const badgeColor = achieved
            ? { backgroundColor: colors.primaryLight, color: colors.primary }
            : {
                backgroundColor: colors.priorityStyles.high.backgroundColor,
                color: colors.priorityStyles.high.color,
              };

          return (
            <Card
              key={key}
              sx={{
                border: `1px solid ${Object.keys(fieldErrors).length ? colors.errorBorder : colors.border}`,
                borderRadius: "1rem",
                boxShadow: "none",
                transition: "border-color 200ms",
                "&:hover": { borderColor: colors.primary },
              }}
            >
              <CardContent sx={{ p: "1.25rem !important" }}>
                {/* Card header */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "0.5rem",
                      backgroundColor: colors.primaryLight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: colors.primary,
                      "& svg": { fontSize: "1.1rem" },
                    }}
                  >
                    {icon}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: colors.textMuted,
                      flex: 1,
                    }}
                  >
                    {t(labelKey)}
                  </Typography>
                  <Chip
                    label={
                      achieved
                        ? t("kpiControl.achieved")
                        : t("kpiControl.notAchieved")
                    }
                    size="small"
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      borderRadius: "0.5rem",
                      ...badgeColor,
                    }}
                  />
                </Box>

                {/* Fields */}
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {/* Value actual */}
                  <Controller
                    name={`${key}.value`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("kpiControl.currentValue")}
                        size="small"
                        fullWidth
                        type="number"
                        sx={inputSx}
                        error={!!fieldErrors.value}
                        helperText={
                          fieldErrors.value ? t(fieldErrors.value.message) : ""
                        }
                        slotProps={
                          isPercent
                            ? {
                                input: {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      %
                                    </InputAdornment>
                                  ),
                                },
                              }
                            : undefined
                        }
                      />
                    )}
                  />

                  {/* Target / Meta */}
                  <Controller
                    name={`${key}.target`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("kpiControl.target")}
                        size="small"
                        fullWidth
                        type="number"
                        sx={inputSx}
                        error={!!fieldErrors.target}
                        helperText={
                          fieldErrors.target
                            ? t(fieldErrors.target.message)
                            : ""
                        }
                        slotProps={
                          isPercent
                            ? {
                                input: {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      %
                                    </InputAdornment>
                                  ),
                                },
                              }
                            : undefined
                        }
                      />
                    )}
                  />

                  {/* Badge / Change label */}
                  <Controller
                    name={`${key}.change`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("kpiControl.badge")}
                        size="small"
                        fullWidth
                        sx={inputSx}
                        error={!!fieldErrors.change}
                        helperText={
                          fieldErrors.change
                            ? t(fieldErrors.change.message)
                            : ""
                        }
                      />
                    )}
                  />
                </Box>

                {/* Preview */}
                <Box
                  sx={{
                    mt: 2,
                    pt: 1.5,
                    borderTop: `1px solid ${colors.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "0.75rem", color: colors.textMuted }}
                  >
                    {t("kpiControl.preview")}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      sx={{ fontWeight: 700, color: colors.textPrimary }}
                    >
                      {isPercent
                        ? `${watched.value ?? 0}%`
                        : Number(watched.value ?? 0).toLocaleString()}
                    </Typography>
                    <Chip
                      label={watched.change || "—"}
                      size="small"
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        borderRadius: "0.5rem",
                        ...badgeColor
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <AlertInline ref={notificationRef} asSnackbar />

      {/* Actions */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          type="button"
          onClick={handleReset}
          startIcon={<RestartAlt />}
          sx={{ ...outlinedButton, px: 3 }}
        >
          {t("kpiControl.reset")}
        </Button>
        <Button
          type="button"
          onClick={handleSubmit(onSubmit, onError)}
          startIcon={<Save />}
          sx={{ ...primaryIconButton, px: 3 }}
        >
          {t("kpiControl.save")}
        </Button>
      </Box>
    </Box>
  );
};
