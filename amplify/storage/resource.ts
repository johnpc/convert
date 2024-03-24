import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "convertFileStorage",
  access: ({ authenticated, guest }) => ({
    "/*": [authenticated.to(["read", "write"]), guest.to(["read", "write"])],
  }),
});
