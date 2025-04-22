import { useAuthStore } from "../../store/authStore.js";
import { useUserStore } from "../../store/userStore.js";
import LatestNews from "./LatestNews.jsx";
import ProfileActivity from "./ProfileActivity.jsx";

const DashboardPage = () => {
	const { user, logout } = useAuthStore();
	const {reset,getFreeNews} = useUserStore();	

	console.log(user.roles)
	const checkApi = async()=>{
		const data= await getFreeNews("Business");
		console.log(data)
	}
	

	const handleLogout = () => {
		reset();
		logout();
	};
	return (
		<div className="flex gap-3  items-center justify-center  flex-wrap">
			<ProfileActivity/>
			<LatestNews/>
			
		</div>
		
	);
};
export default DashboardPage;