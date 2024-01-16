import { A } from "@solidjs/router";
import { Logo } from "../Logo";
import { Show } from "solid-js";
import { useAuth } from "~/contexts/useAuth";
import { useCart } from "~/contexts/useCart";
import { TbShoppingCart } from "solid-icons/tb";

const Navbar = () => {
	const { cartItems, logout } = useCart();
	const { user, loading, login } = useAuth();

	return (
		<div class="navbar w-full bg-primary/20 relative sm:sticky top-0 z-50 backdrop-blur-lg">
			<div class="md:flex hidden justify-between w-full container mx-auto ">
				<Logo />
				<div class="flex items-center space-x-3">
					<Show
						when={!loading()!}
						fallback={
							<div class="skeleton w-12 h-12 rounded-box shrink-0"></div>
						}
					>
						<A href="/cart">
							<div class="dropdown dropdown-end">
								<div
									tabindex="0"
									role="button"
									class="btn btn-ghost btn-circle bg-primary/20 hover:bg-primary/30"
								>
									<div class="indicator">
										<TbShoppingCart size={20} />
										<span class="badge badge-sm indicator-item text-red-600">
											{cartItems.length}
										</span>
									</div>
								</div>
							</div>
						</A>
					</Show>
					<Show
						when={!loading()!}
						fallback={
							<div class="skeleton w-12 h-12 rounded-box shrink-0"></div>
						}
					>
						<Show
							when={user()}
							fallback={
								<a href={`https://backend.riverbase.org/sso/store`}>
									<button class="btn px-14 rounded-box bg-primary/10 hover:bg-primary/5 text-primary border-none">
										Login
									</button>
								</a>
							}
						>
							<div class="dropdown dropdown-end">
								<label
									tabIndex={0}
									class="btn btn-ghost btn-circle avatar bg-primary/20 hover:bg-primary/20 placeholder"
								>
									<span>{user().fullname?.charAt(0).toUpperCase()}</span>
								</label>
								<ul
									tabIndex={0}
									class="p-2 shadow menu dropdown-content z-[1] bg-primary/5 rounded-box w-52 mt-2"
								>
									<li>
										<A href={`me/@${user().fullname?.toLowerCase()}`}>
											Profile
										</A>
									</li>
									<li>
										<A href={`me/history`}>History</A>
									</li>
									<li>
										<A href={`me/delivery`}>Delivery</A>
									</li>
									<li>
										<button onClick={() => logout()}>Logout</button>
									</li>
								</ul>
							</div>
						</Show>
					</Show>
				</div>
			</div>
			{/* mobile responsive */}
			<div class="md:hidden text-center w-full">
				<Logo />
			</div>
		</div>
	);
};

export default Navbar;
