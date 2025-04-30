import { useAuthStore } from "../../store/authStore.js";
import { useUserStore } from "../../store/userStore.js";
import DailyQuotes from "./DailyQuotes.jsx";
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
		<div className="flex gap-1 m-20 justify-center  flex-wrap">
			<DailyQuotes/>			
			<LatestNews/>
			<ProfileActivity/>
		</div>
		
	);
};
export default DashboardPage;