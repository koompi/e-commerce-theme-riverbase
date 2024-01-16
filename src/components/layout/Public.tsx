// import SideBar from "./SideBar";
import {
	Component,
	JSXElement,
	Show,
	createEffect,
	createSignal,
	onCleanup,
} from "solid-js";
// import Breadcrumb from "../Breadcrumb";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLocation } from "solid-start";

interface layoutProps {
	children: JSXElement;
}

const PublicLayout: Component<layoutProps> = (props) => {
	const router = useLocation();
	// const [scrollPosition, setScrollPosition] = createSignal(0);
	// const handleScroll = () => {
	//   // Update the scroll position when scrolling
	//   setScrollPosition(window.scrollY);
	// };
	// if (typeof window !== "undefined") {
	//   window.addEventListener("scroll", handleScroll);

	//   // Cleanup the event listener when the component is unmounted
	//   onCleanup(() => {
	//     window.removeEventListener("scroll", handleScroll);
	//   });
	// }

	return (
		<div class="relative pb-16">
			<Show when={!router.pathname.startsWith("/search")}>
				<Navbar />
			</Show>
			<main class="mb-16">{props.children}</main>
			<Show when={!router.pathname.startsWith("/me")}>
				<Footer />
			</Show>
		</div>
	);
};

export default PublicLayout;
