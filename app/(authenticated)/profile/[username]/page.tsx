import ProfilePage from "@/components/pages/ProfilePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    typeof window !== "undefined"
      ? `Perfil de ${window.location.pathname.split("/").at(-1)}`
      : "Perfil",
};

interface ProfileComponentProps {
  params: { username: string };
}

const ProfileComponent = ({ params }: ProfileComponentProps) => {
  return <ProfilePage params={params} />;
};

export default ProfileComponent;
