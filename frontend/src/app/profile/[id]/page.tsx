import ProfileClient from "@/components/profile/ProfileClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User's profile",
  description: "See the user's collection and followed users",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
