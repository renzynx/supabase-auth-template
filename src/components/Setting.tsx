import ChangePassword from "@/layouts/ChangePassword";
import { Box, Container, Divider, Stack, Typography } from "@mui/material";

const Setting = () => {
  return (
    <Container maxWidth="xl" sx={{ my: 2 }}>
      <Box
        sx={{
          display: "flex",
          gap: "2rem",
          justifyContent: "stretch",
          alignItems: "stretch",
        }}
      >
        <Stack sx={{ flexGrow: 1 }}>
          <Typography variant="h6">Security</Typography>
          <Divider sx={{ my: 2 }} />
          <ChangePassword />
        </Stack>
      </Box>
    </Container>
  );
};

export default Setting;
