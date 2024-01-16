import { A, useLocation } from "solid-start";
import {
	RiBuildingsHome4Fill,
	RiBuildingsHome4Line,
	RiFinanceShoppingBagFill,
	RiFinanceShoppingBagLine,
	RiUserFacesAccountCircleFill,
	RiUserFacesAccountCircleLine,
} from "solid-icons/ri";

import { FiSearch } from "solid-icons/fi";
import { Show } from "solid-js";
import { useAuth } from "~/contexts/useAuth";
import { useCart } from "~/contexts/useCart";
import { TbHistory, TbLogout, TbTruckDelivery, TbUser } from "solid-icons/tb";

const MobileTopBar = () => {
	const { user, loading, login } = useAuth();
	const { cartItems, logout } = useCart();
	const location = useLocation();

	return (
		<>
			<div class="btm-nav h-20 bg-primary/20 z-50 xl:hidden backdrop-blur-sm">
				<A href="/" class="border-none bg-transparent">
					<Show
						when={location.pathname === "/"}
						fallback={
							<label class="btn-md flex justify-center btn-ghost btn-circle avatar">
								<div class="w-7 rounded-box">
									<RiBuildingsHome4Line class="h-full w-full text-primary" />
								</div>
							</label>
						}
					>
						<label class="btn-md flex justify-center btn-ghost btn-circle avatar bg-primary/20 hover:bg-primary/20">
							<div class="w-7 rounded-box">
								<RiBuildingsHome4Fill class="h-full w-full text-primary" />
							</div>
						</label>
					</Show>
				</A>

				{/* <A href="/search" class="border-none bg-transparent">
					<Show
						when={location.pathname === "/search"}
						fallback={
							<label class="btn-md flex justify-center btn-ghost btn-circle avatar">
								<div class="w-7 rounded-box">
									<FiSearch class="h-full w-full text-primary" />
								</div>
							</label>
						}
					>
						<label class="btn-md flex justify-center btn-ghost btn-circle avatar bg-primary/20 hover:bg-primary/20">
							<div class="w-7 rounded-box">
								<FiSearch class="h-full w-full text-primary" />
							</div>
						</label>
					</Show>
				</A> */}

				<A href="/cart" class="border-none bg-transparent">
					<Show
						when={
							location.pathname === "/cart" ||
							location.pathname === "/checkouts"
						}
						fallback={
							<label class="btn-md flex justify-center btn-ghost btn-circle avatar indicator">
								<Show when={cartItems.length > 0}>
									<span class="indicator-item badge badge-secondary">
										{cartItems.length}
									</span>
								</Show>
								<div class="w-7 rounded-box">
									<RiFinanceShoppingBagLine class="h-full w-full text-primary" />
								</div>
							</label>
						}
					>
						<label class="btn-md flex justify-center btn-ghost btn-circle avatar bg-primary/20 hover:bg-primary/20 indicator">
							<span class="indicator-item badge badge-secondary">
								{cartItems.length}
							</span>
							<div class="w-7 rounded-box">
								<RiFinanceShoppingBagFill class="h-full w-full text-primary" />
							</div>
						</label>
					</Show>
				</A>
				<Show
					when={user()}
					fallback={
						<A
							href={`https://backend.riverbase.org/sso/store`}
							class="border-none bg-transparent"
						>
							<label class="btn-md flex justify-center btn-ghost btn-circle avatar bg-primary/20 hover:bg-primary/20">
								<div class="w-7 rounded-box">
									<RiUserFacesAccountCircleLine class="h-full w-full text-primary" />
								</div>
							</label>
						</A>
					}
				>
					<A
						href={`me/@${user()?.first_name?.toLowerCase()}`}
						class="border-none bg-transparent"
						onClick={(e) => e.preventDefault()}
					>
						<div class="dropdown dropdown-top dropdown-end">
							<label
								tabIndex={0}
								class="btn btn-md flex justify-center btn-ghost btn-circle avatar bg-primary/20 hover:bg-primary/20"
							>
								<div class="w-8 rounded-box">
									<RiUserFacesAccountCircleFill class="h-full w-full text-primary" />
								</div>
							</label>
							<ul
								tabIndex={0}
								class="-mr-8 mb-8 bg-base-100 dropdown-content z-[1] shadow menu menu-sm rounded-box w-52 border px-1"
							>
								<li>
									<A
										href={`/me/@${user()?.first_name?.toLowerCase()}`}
										class="flex py-2 place-content-between"
									>
										Profile
										<button class="btn btn-circle btn-sm bg-primary/20 ">
											<TbUser size={18} />
										</button>
									</A>
								</li>
								<li>
									<A
										href={`/me/history`}
										class="flex py-2 place-content-between"
									>
										History
										<button class="btn btn-circle btn-sm bg-primary/20">
											<TbHistory size={18} />
										</button>
									</A>
								</li>
								<li>
									<A
										href={`me/delivery`}
										class="flex py-2 place-content-between"
									>
										Delivery
										<button class="btn btn-circle btn-sm bg-primary/20">
											<TbTruckDelivery size={18} />
										</button>
									</A>
								</li>
								<li>
									<A
										class="flex py-2 place-content-between"
										href="/logout"
										onClick={(e) => {
											e.preventDefault();
											logout();
											window?.location.replace("/");
										}}
									>
										Logout
										<button class="btn btn-circle btn-sm bg-primary/20">
											<TbLogout size={18} />
										</button>
									</A>
								</li>
							</ul>
						</div>
					</A>
				</Show>
			</div>
		</>
	);
};

export default MobileTopBar;
