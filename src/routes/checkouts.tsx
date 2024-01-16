import { DELIVERIES, DELIVERIES_EXPRESS } from "~/libs/graphql/delivery";
import { FaSolidCircleCheck, FaSolidPhone } from "solid-icons/fa";
import { For, Show, createEffect, createSignal } from "solid-js";
import { SubmitHandler, createForm, required } from "@modular-forms/solid";
import { client, clientQuery } from "~/libs/client";

import Button from "~/components/Button";
import { CHECKOUT_PRODUCT } from "~/libs/graphql/checkout";
import { CheckoutType } from "~/types/checkout";
import { DeliveryForm } from "~/components/forms/DeliveryForm";
import { Dialog } from "~/components/Dialog";
import { EmptyCart } from "~/components/Empty";
import { ORDER_PRODUCT } from "~/libs/graphql/order";
import PrivateLayout from "~/components/layout/Private";
import toast from "solid-toast";
import { useCart } from "~/contexts/useCart";
import { useNavigate } from "solid-start";

export default function Checkout() {
	const navigate = useNavigate();
	const [open, setOpen] = createSignal<string | null>(null);
	const [_, { Form, Field }] = createForm<CheckoutType>();

	const [process, setProcess] = createSignal(false);
	const { cartItems, minusCart, removeFromCart, addToCart, cleanCartItems } =
		useCart();

	const [price, setPrice] = createSignal(0);

	createEffect(() => {
		const subtotal: number[] = [];
		cartItems.map((product) =>
			subtotal.push(product.quantity * product.product.price)
		);
		const Subtotal: any = subtotal.reduce((accumulator, value) => {
			return accumulator + value;
		}, 0);
		setPrice(Subtotal);
	});

	const handleCheckout: SubmitHandler<CheckoutType> = (values) => {
		if (!values.payment) {
			toast.error("Please select payment cash to delivery");
			return;
		}
		if (!values.delivery_option) {
			toast.error("Please select delivery option location to delivery");
			return;
		}
		const carts = cartItems.map((cart) => {
			setProcess(true);
			return {
				productId: cart.product.id,
				qty: cart.quantity,
				unitPrice: parseInt(cart.product.price.toString()),
			};
		});
		const variables = {
			input: {
				carts: carts,
				currency: "USD",
				totalPrice: price(),
				type: "USER",
			},
		};

		client
			.mutation(ORDER_PRODUCT, variables)
			.toPromise()
			.then((res) => {
				if (res.error) {
					return toast.error(res.error.message);
				}
				client
					.mutation(CHECKOUT_PRODUCT, {
						orderId: res.data.storeCreateOrder.id,
						payment: values.payment,
						deliveryOptionId: values.delivery_option,
						deliveryId: null,
					})
					.toPromise()
					.then((_) => {
						if (res.error) {
							return toast.error(res.error.message);
						}
						setTimeout(() => {
							setProcess(false);
							setOpen(() => "my_modal_2");
						}, 1000);
					});
			});
	};

	return (
		<PrivateLayout>
			<Show when={cartItems.length > 0} fallback={<EmptyCart />}>
				<Form onSubmit={handleCheckout} class="p-4">
					<Dialog
						modalId={open}
						// modalId={() => "my_modal_2"}
						classes="sm:w-1/2 max-h-min  flex justify-center text-center rounded-xl p-6"
					>
						<div class="w-full h-full  space-y-2">
							<div class="flex justify-center font-bold text-2xl">
								You've successfully purchased the products!
							</div>
							<img
								alt=""
								src="/images/cta.png"
								class="h-2/3 mx-auto flex-grow"
							/>
							<button
								class="btn btn-primary btn-block rounded-box"
								onClick={(e) => {
									e.preventDefault();
									cleanCartItems();
									navigate("/me/history");
								}}
							>
								Continue
							</button>
						</div>
					</Dialog>
					<div>
						<div class="grid md:grid-cols-2 gap-8 mt-8">
							<main class=" ">
								<div class="bg-primary/10 p-5 rounded-xl shadow-sm">
									<DeliveryOption Field={Field} />
									<div class="flex justify-start">
										<h1 class="text-xl font-semibold pb-8">Payments</h1>
									</div>
									<div class="grid md:grid-cols-2 gap-4">
										<For
											each={[
												{ label: "cash", value: "CASH" },
												{ label: "credit", value: "credit-debit-card" },
												{ label: "ABA Pay", value: "aba-pay" },
												{ label: "Wing Pay", value: "wing-pay" },
												{
													label: "Chip Mong Bank",
													value: "chip-mong-bank",
												},
												{ label: "Acleda Pay", value: "xpay" },
											]}
										>
											{({ value }, index) => (
												<Field
													name="payment"
													validate={[required("Please select your payment.")]}
												>
													{(field, props) => (
														<div
															class={`rounded-xl p-3 bg-primary/10`}
															classList={{
																"ring ring-primary":
																	field.value?.includes(value),
															}}
														>
															<label class="w-full flex gap-6 items-center cursor-pointer   ">
																<input
																	{...props}
																	class="radio radio-primary"
																	type="radio"
																	value={value}
																	checked={field.value?.includes(value)}
																/>
																<img
																	class="h-10"
																	src={`/images/banks/${value}.png`}
																	alt=""
																/>
															</label>
														</div>
													)}
												</Field>
											)}
										</For>
									</div>
								</div>
								{/* <Delivery Field={Field} /> */}
							</main>
							<main class="w-full">
								<div class="bg-primary/10 p-6 rounded-xl">
									<h1 class="text-xl font-semibold pb-2">
										My shopping bag ({cartItems.length})
									</h1>
									<For each={cartItems}>
										{(cartItem) => {
											return (
												<Show when={cartItem} fallback={<p>Loading...</p>}>
													<div class="md:flex md:justify-between md:items-center pt-6">
														<div class="flex items-center space-x-3">
															<div>
																<div class="avatar">
																	<div class="w-24 rounded">
																		<img
																			src={`${
																				import.meta.env.VITE_VARIABLE_IPFS
																			}/api/ipfs?hash=${
																				cartItem?.product?.preview
																			}`}
																			alt=""
																		/>
																	</div>
																</div>
															</div>
															<div>
																<h1>{cartItem.product?.title}</h1>
																<div class="flex">
																	<p>
																		{cartItem.product.price} x
																		{cartItem.quantity}
																	</p>
																	=
																	<p class="font-bold ">
																		$
																		{cartItem.product.price * cartItem.quantity}
																	</p>
																</div>
															</div>
														</div>
														<div class="flex space-x-7 items-center md:mt-0 mt-2">
															<div class="flex space-x-3 items-center">
																{cartItem.quantity === 1 ? (
																	<div class="bg-gray-100 p-1 rounded-box cursor-pointer">
																		<div>
																			<svg
																				xmlns="http://www.w3.org/2000/svg"
																				fill="none"
																				viewBox="0 0 24 24"
																				stroke-width="1.5"
																				stroke="currentColor"
																				class="w-5 h-5 text-gray-600"
																			>
																				<path
																					stroke-linecap="round"
																					stroke-linejoin="round"
																					d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
																				/>
																			</svg>
																		</div>
																	</div>
																) : (
																	<div class="bg-orange-100 p-1 rounded-box cursor-pointer">
																		<div
																			onclick={() =>
																				minusCart(cartItem.product)
																			}
																		>
																			<svg
																				xmlns="http://www.w3.org/2000/svg"
																				fill="none"
																				viewBox="0 0 24 24"
																				stroke-width="1.5"
																				stroke="currentColor"
																				class="w-5 h-5 text-orange-600"
																			>
																				<path
																					stroke-linecap="round"
																					stroke-linejoin="round"
																					d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
																				/>
																			</svg>
																		</div>
																	</div>
																)}

																<div class="bg-green-100 p-1 rounded-box cursor-pointer">
																	<div
																		onclick={() => addToCart(cartItem.product)}
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke-width="1.5"
																			stroke="currentColor"
																			class="w-5 h-5 text-green-600"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
																			/>
																		</svg>
																	</div>
																</div>
															</div>
															<div
																onClick={() =>
																	removeFromCart(cartItem.product.id)
																}
																class="bg-red-100 p-1 rounded-box cursor-pointer"
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke-width="1.5"
																	stroke="currentColor"
																	class="w-4 h-4 text-red-500"
																>
																	<path
																		stroke-linecap="round"
																		stroke-linejoin="round"
																		d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
																	/>
																</svg>
															</div>
														</div>
													</div>
												</Show>
											);
										}}
									</For>
								</div>
								<div class=" md:col-span-2 mt-9 md:mt-6 bg-primary/10 p-4 rounded-xl">
									<div class="grid grid-cols-1 justify-start">
										<h1 class="font-bold uppercase">Summary</h1>
									</div>
									<div class="divider mt-2"></div>
									<div class="grid grid-cols-2">
										<div class="col-span-1 flex justify-start text-md">
											Subtotal
										</div>
										<div class="col-span-1 font-bold flex justify-end">
											{price()} USD
										</div>
									</div>
									<div class="grid grid-cols-2 md:mt-2">
										<div class="col-span-1 flex justify-start text-md">
											Estimated Shipping & Handling
										</div>
										<div class="col-span-1 font-bold flex justify-end">
											{price()} USD
										</div>
									</div>
									<div class="grid grid-cols-2 md:mt-2">
										<div class="col-span-1 flex justify-start text-md">
											Estimated Tax
										</div>
										<div class="col-span-1 font-bold flex justify-end">-</div>
									</div>
									<div class="divider my-2"></div>
									<div class="grid grid-cols-2 justify-start">
										<div class="col-span-1 flex justify-start text-md">
											Total
										</div>
										<h1 class="font-bold uppercase flex justify-end">
											{price()} USD
										</h1>
									</div>
									{/* delivery */}
									{/* <DeliveryOptionMobile Field={Field} /> */}
									<div class="md:pt-6 pt-10">
										<button class="btn btn-primary w-full rounded-box">
											{process() ? (
												<span class="loading loading-spinner"></span>
											) : (
												"Pay"
											)}
										</button>
									</div>
								</div>
							</main>
						</div>
					</div>
				</Form>
			</Show>
		</PrivateLayout>
	);
}

const Delivery = ({ Field }: any) => {
	const [data] = clientQuery(DELIVERIES_EXPRESS, {});

	return (
		<Show when={!data.loading} fallback={<div>loading...</div>}>
			<h1 class="collapse-title text-xl font-semibold px-0 py-8">
				Delivery Options
			</h1>
			<div class="pb-8 ">
				<Show when={data().storeDeliveriesExpress.length > 0} fallback={null}>
					<section class="grid grid-cols-2 gap-3 items-center px-2 pb-6">
						<For each={data().storeDeliveriesExpress} fallback={null}>
							{(delivery) => {
								return (
									<Field
										name="delivery_express"
										validate={[required("Please select your delivery.")]}
									>
										{(field: any, props: any) => (
											<label class="cursor-pointer ">
												<input
													{...props}
													type="radio"
													value={delivery.id}
													checked={field.value?.includes(delivery.id)}
													class="radio peer sr-only"
													required
													name="delivery_express"
												/>
												<div class="w-full grid grid-cols-4 gap-3 rounded-md p-5 text-gray-600 ring-2 ring-transparent transition-all hover:shadow peer-checked:text-primary peer-checked:ring-primary peer-checked:ring-offset-2">
													<div class="avatar col-span-1">
														<div class="w-12 rounded-xl">
															<img
																src={`${
																	import.meta.env.VITE_VARIABLE_IPFS
																}/api/ipfs?hash=${delivery?.logo}`}
																alt={delivery.name}
															/>
														</div>
													</div>
													<div class="col-span-3">
														<div class="flex items-center gap-6 justify-between">
															<p class="text-sm font-semibold uppercase text-pimary">
																{delivery.name}
															</p>
															<FaSolidCircleCheck class="text-xl" />
														</div>
														<div class="flex gap-3 items-center">
															<FaSolidPhone class="text-sm" />
															<p class="text-sm font-medium">
																{delivery.phoneNumber}
															</p>
														</div>
													</div>
												</div>
											</label>
										)}
									</Field>
								);
							}}
						</For>
					</section>
				</Show>
			</div>
		</Show>
	);
};

const DeliveryOption = ({ Field }: any) => {
	const [data, { refetch }] = clientQuery(DELIVERIES, {});

	return (
		<Show when={!data.loading} fallback={<div>loading...</div>}>
			<h1 class="collapse-title text-xl font-semibold px-0 py-0">
				Delivery Location
			</h1>
			<Show when={data().deliveries.length > 0} fallback={null}>
				<section class="flex flex-wrap gap-3 flex-col  mb-6 relative">
					<For each={data().deliveries} fallback={null}>
						{(delivery) => {
							return (
								<Field
									name="delivery_option"
									validate={[required("Please select your delivery option.")]}
								>
									{(field: any, props: any) => (
										<label class="cursor-pointer ">
											<input
												{...props}
												type="radio"
												value={delivery.id}
												checked={field.value?.includes(delivery.id)}
												class="radio peer sr-only"
												required
												name="delivery"
											/>
											<div class="rounded-xl p-5 text-gray-600 ring-2 ring-transparent transition-all peer-checked:text-primary peer-checked:ring-primary peer-checked:ring-offset-2">
												<div class="flex items-center gap-6 justify-between">
													<p class="text-sm font-semibold uppercase text-pimary">
														{delivery.address}
													</p>
													<FaSolidCircleCheck class="text-xl" />
												</div>
												<div class="flex gap-3 items-center">
													<FaSolidPhone class="text-sm" />
													<p class="text-sm font-medium">
														{delivery.phoneNumber}
													</p>
												</div>
											</div>
										</label>
									)}
								</Field>
							);
						}}
					</For>
				</section>
			</Show>
			<div class="collapse bg-primary/10 collapse-plus mb-6">
				<input type="checkbox" />
				<div class="collapse-title text-md font-medium">Add new location</div>
				<div class="collapse-content">
					<DeliveryForm refetch={refetch} />
				</div>
			</div>
		</Show>
	);
};

const DeliveryOptionMobile = ({ Field }: any) => {
	const [data, { refetch }] = clientQuery(DELIVERIES, {});

	return (
		<main class="mt-6 md:hidden">
			<div class="grid grid-cols-1 justify-start">
				<Show when={!data.loading} fallback={<div>loading...</div>}>
					<div class="flex justify-start">
						<div
							class={`collapse ${
								data().deliveries.length <= 0 && "collapse-open"
							} p-0`}
						>
							<input type="checkbox" class="peer" />
							<h1 class="collapse-title text-xl font-semibold pb-4 px-0 py-0">
								Delivery Options
							</h1>
							<div class="collapse-content">
								<DeliveryForm refetch={refetch} />
							</div>
						</div>
					</div>
					<div class="pb-8 px-4">
						<div class="flex justify-start">
							<div class="gird grid-cols-1 space-y-6">
								<For each={data().deliveries} fallback={<div>loading...</div>}>
									{(delivery) => (
										<Field name="delivery_option">
											{(field: any, props: any) => (
												<label class="w-full flex col-span-8 gap-6 items-center">
													<input
														{...props}
														class="radio"
														type="radio"
														value={delivery.id}
														checked={field.value?.includes(delivery.id)}
														required
													/>
													<div>{delivery.address}</div>
												</label>
											)}
										</Field>
									)}
								</For>
							</div>
						</div>
					</div>
				</Show>
			</div>
			<div class="grid grid-cols-1 justify-start">
				<h1 class="font-bold text-xl">Payments</h1>
				<div class="flex justify-start w-full px-4 mt-8">
					<div class="grid grid-cols-8 gap-4 space-y-4">
						<For
							each={[
								{ label: "credit", value: "credit-debit-card" },
								{ label: "ABA Pay", value: "aba-pay" },
								{ label: "Wing Pay", value: "wing-pay" },
								{
									label: "Chip Mong Bank",
									value: "chip-mong-bank",
								},
								{ label: "Acleda Pay", value: "xpay" },
							]}
						>
							{({ value }) => (
								<Field name="payment">
									{(field: any, props: any) => (
										<label class="w-full flex col-span-8 gap-6 items-center">
											<input
												{...props}
												class="radio"
												type="radio"
												value={value}
												checked={field.value?.includes(value)}
												required
											/>
											<img
												class="h-12"
												src={`/images/banks/${value}.png`}
												alt=""
											/>
										</label>
									)}
								</Field>
							)}
						</For>
					</div>
				</div>
			</div>
		</main>
	);
};
