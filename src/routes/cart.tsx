import { For, Show, createEffect, createSignal } from "solid-js";

import { A } from "solid-start";
import Button from "~/components/Button";
import { EmptyCart } from "~/components/Empty";
import { FiShoppingCart } from "solid-icons/fi";
import { useCart } from "~/contexts/useCart";
import { TbMinus, TbPlus, TbTrash } from "solid-icons/tb";

export default function Cart() {
	const { cartItems, addToCart, minusCart, removeFromCart } = useCart();

	const [price, setPrice] = createSignal(0);
	createEffect(() => {
		const subtotal: number[] = [];
		cartItems.map((product: any) =>
			subtotal.push(product.quantity * product.product.price)
		);
		const Subtotal: any = subtotal.reduce((accumulator, value) => {
			return accumulator + value;
		}, 0);
		setPrice(Subtotal);
	});
	return (
		<main class="container mx-auto  p-4">
			<Show when={cartItems.length > 0} fallback={<EmptyCart />}>
				<div>
					<h2 class="text-2xl opacity-80 font-bold mb-8">Shopping Cart</h2>
					<div class="grid md:grid-cols-5 md:gap-6">
						<div class="md:col-span-3">
							<div class="backdrop-blur-sm  bg-opacity-80 gap-2 flex flex-col">
								<For each={cartItems}>
									{(cartItem) => {
										return (
											<Show when={cartItem} fallback={<p>Loading...</p>}>
												<div class="bg-primary/10 md:flex md:justify-between md:items-center p-4 rounded-box">
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
																		class="rounded-md"
																	/>
																</div>
															</div>
														</div>
														<div>
															<h1>{cartItem.product?.name}</h1>
															<div class="flex">
																<p>
																	{cartItem.product.price.toLocaleString()} x
																	{cartItem.quantity}
																</p>
																=
																<p class="font-bold mr-4">
																	$
																	{(
																		cartItem.product.price * cartItem.quantity
																	).toLocaleString()}
																</p>
															</div>
														</div>
													</div>
													<div class="flex space-x-7 items-center md:mt-0 mt-2">
														<div class="flex space-x-3 items-center">
															{cartItem.quantity === 1 ? (
																<div class="btn btn-xs btn-circle btn-outline btn-disabled">
																	<TbMinus />
																</div>
															) : (
																<div
																	onclick={() => minusCart(cartItem.product)}
																	class="btn btn-xs btn-circle btn-outline btn-error"
																>
																	<TbMinus />
																</div>
															)}

															<div class=" p-1 rounded-box cursor-pointer">
																<div
																	onclick={() => addToCart(cartItem.product)}
																	class="btn btn-xs btn-circle btn-outline btn-success"
																>
																	<TbPlus />
																</div>
															</div>
														</div>
														<div
															onClick={() =>
																removeFromCart(cartItem.product.id)
															}
															class="btn btn-xs btn-circle btn-outline btn-error"
														>
															<TbTrash />
														</div>
													</div>
												</div>
											</Show>
										);
									}}
								</For>
							</div>
							{/* <A href="/products" class="">
								
							</A> */}
							<div class="px-2">
								<button class="btn btn-primary btn-block rounded-box my-8 ">
									<FiShoppingCart class="text-xl" />
									More Products
								</button>
							</div>
						</div>

						<div class="md:col-span-2  rounded-xl">
							<div class=" p-2 md:p-6 rounded-xl">
								<div class="grid grid-cols-1 justify-start">
									<h1 class="font-bold text-lg uppercase">Summary</h1>
								</div>
								<div class="divider mt-2"></div>
								<div class="grid grid-cols-2">
									<div class="col-span-1 flex justify-start text-md">
										Subtotal
									</div>
									<div class="col-span-1 font-bold flex justify-end">
										USD {price().toLocaleString()}
									</div>
								</div>
								<div class="grid grid-cols-2 md:mt-2">
									<div class="col-span-1 flex justify-start text-md">
										Shipping
									</div>
									<div class="col-span-1 font-bold flex justify-end">0 USD</div>
								</div>
								<div class="grid grid-cols-2 md:mt-2">
									<div class="col-span-1 flex justify-start text-md">
										Estimated Tax
									</div>
									<div class="col-span-1 font-bold flex justify-end">-</div>
								</div>
								<div class="divider my-2"></div>
								<div class="grid grid-cols-2 justify-start">
									<div class="col-span-1 flex justify-start text-md">Total</div>
									<h1 class="font-bold uppercase flex justify-end">
										USD {price().toLocaleString()}
									</h1>
								</div>
								<div class="pt-6">
									<A href="/checkouts">
										<button class="btn btn-primary w-full shadow-none rounded-box">
											Checkout
										</button>
									</A>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Show>
		</main>
	);
}
