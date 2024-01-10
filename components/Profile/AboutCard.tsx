import { User } from "@/types/user";
import { FunctionComponent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSquareFacebook,
	faSquareInstagram,
	faSquareXTwitter,
} from "@fortawesome/free-brands-svg-icons";

interface AboutCardProps {
	user: User;
}

const AboutCard: FunctionComponent<AboutCardProps> = ({ user }) => {
	return (
		<div className="w-full border rounded-md p-4 flex flex-col justify-center items-center">
			{user.profilePhotoPresignedGet && <div className="max-w-xs border-4 rounded-md">
				<img
					src={user.profilePhotoPresignedGet}
					alt="Profile"
					className="w-full h-full"
				/>
			</div>}

			<p className="mt-4">{user.biography ?? "Sem informações por aqui :("}</p>

			<div className="flex gap-4 mt-6">
				{user.usernameInstagram && (
					<a href={`https://www.instagram.com/${user.usernameInstagram}`}>
						<FontAwesomeIcon icon={faSquareInstagram} className="text-4xl" />
					</a>
				)}
				{user.usernameFacebook && (
					<a href={`https://www.facebook.com/${user.usernameFacebook}`}>
						<FontAwesomeIcon icon={faSquareFacebook} className="text-4xl" />
					</a>
				)}
				{user.usernameTwitter && (
					<a href={`https://twitter.com/${user.usernameTwitter}`}>
						<FontAwesomeIcon icon={faSquareXTwitter} className="text-4xl" />
					</a>
				)}
			</div>
		</div>
	);
};

export default AboutCard;
