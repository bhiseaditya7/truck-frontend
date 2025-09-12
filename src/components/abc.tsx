import React from "react.";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  IconButton,
  Stack,
  Alert,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Mail, Lock, Eye, EyeOff, Scan ,User } from "lucide-react";
import { FormErrors2, RegistrationFormData } from "../Login";

interface RegistrationFormProps {
  formData: RegistrationFormData;
  errors: FormErrors2;
  formError: string;
  isLoading: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onToggleForm: () => void;
}

const RegisterForm: React.FC<RegistrationFormProps> = ({
  formData,
  errors,
  formError,
  isLoading,
  showPassword,
  onTogglePassword,
  onChange,
  onSubmit,
  onToggleForm,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "50%" },
        minHeight: { xs: "100vh", md: "auto" },
        position: "relative",
        bgcolor: theme.palette.background.default,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, rgba(147,51,234,0) 0%, rgba(147,51,234,0.2) 50%, rgba(147,51,234,0) 100%)",
        },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 4 },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{ width: "100%", maxWidth: { xs: "100%", sm: 420 }, mx: "auto" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: { xs: 4, md: 6 },
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <IconButton
              sx={{
                bgcolor: theme.palette.primary.main,
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: 2,
                "&:hover": { bgcolor: theme.palette.primary.dark },
              }}
            >
              <Scan size={isMobile ? 20 : 24} color="white" />
            </IconButton>
            <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{ color: theme.palette.text.primary, fontWeight: "bold" }}
              >
                new
              </Typography>
              <Typography variant="body2" color="text.secondary">
                new
              </Typography>
            </Box>
          </Box>

          {/* {formError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {formError}
            </Alert>
          )} */}

          <Typography
            variant={isMobile ? "h4" : "h3"}
            sx={{
              color: theme.palette.text.primary,
              fontWeight: "bold",
              mb: 1,
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Create your account
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mb: 4, textAlign: { xs: "center", sm: "left" } }}
          >
            Register to unlock face recognition tools and analytics
          </Typography>

          <Box
            component="form"
            onSubmit={onSubmit}
            sx={{
              mt: { xs: 3, sm: 4 },
              "& .MuiTextField-root": { mb: { xs: 2, sm: 3 } },
            }}
          >
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={onChange}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ mr: 2, display: "flex" }}>
                    <Mail color={theme.palette.text.secondary} size={20} />
                  </Box>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Full name"
              name="name"
              value={formData.name}
              onChange={onChange}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ mr: 2, display: "flex" }}>
                    <User color={theme.palette.text.secondary} size={20} />
                  </Box>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password1"
              type={showPassword ? "text" : "password"}
              value={formData.password1}
              onChange={onChange}
              error={!!errors.password1}
              helperText={errors.password1}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ mr: 2, display: "flex" }}>
                    <Lock color={theme.palette.text.secondary} size={20} />
                  </Box>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={onTogglePassword}
                      edge="end"
                      size="small"
                      sx={{ color: "text.secondary" }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={onChange}
              error={!!errors.password}
              helperText={errors.password}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ mr: 2, display: "flex" }}>
                    <Lock color={theme.palette.text.secondary} size={20} />
                  </Box>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={onTogglePassword}
                      edge="end"
                      size="small"
                      sx={{ color: "text.secondary" }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Stack spacing={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size={isMobile ? "medium" : "large"}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign Up"}
              </Button>
            </Stack>
            <Typography
              align="center"
              color="text.secondary"
              sx={{ mt: { xs: 3, sm: 4 }, fontSize: isMobile ? 14 : 16 }}
            >
              Already have an account? <Button color="primary" onClick={onToggleForm}>Sign in</Button>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterForm;
