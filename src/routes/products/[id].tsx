import { A, useParams } from "@solidjs/router";
import { Accessor, For, Show, createEffect, createSignal } from "solid-js";

import { AiFillStar } from "solid-icons/ai";
import { CartItem } from "~/types/global";
import { GET_PRODUCT } from "~/libs/graphql/product";
import Image from "~/components/Image";
import { ItemProduct } from "~/types/product";
import { LexicalViewer } from "~/components/LexicalViewer";
import { MeteTag } from "~/components/meta";
import { publicQuery } from "~/libs/client";
import toast from "solid-toast";
import { useCart } from "~/contexts/useCart";
import { useNavigate } from "@solidjs/router";

const ProductDetail = () => {
	const navigate = useNavigate();
	const { addToCart, cartItems, addCarts } = useCart();
	const params = useParams<{ id: string }>();
	const [thumb, setThumb] = createSignal<number>(0);
	const [items, setItems] = createSignal<CartItem[]>([]);
	const [active, setActive] = createSignal<string>();

	const viewImage = () => {
		return `${import.meta.env.VITE_VARIABLE_IPFS}/api/ipfs?hash=${
			product()?.storeProduct?.previews[thumb()]
		}`;
	};

	const [product] = publicQuery(GET_PRODUCT, () => ({
		slug: params.id,
	}));

	const handleAddToCart = (product: ItemProduct) => {
		let p: ItemProduct = {
			id: product.id,
			name: product.name,
			price: product.price,
			currency: product.currency,
			preview: product.preview,
		};
		addToCart(p);
	};

	const isInCart = (id: string) => {
		const data = cartItems.some((item: CartItem) => item?.product?.id === id);
		return data;
	};

	createEffect(() => {
		isInCart(product().storeProduct.id);
	});

	return (
		<>
			<MeteTag name="detail" />
			<div class="px-3 md:px-16 pb-12 sm:pb-0">
				<div class="pt-6">
					<Show when={product()} fallback={<div>Loading ...</div>}>
						<Show
							when={!product().productStore}
							fallback={<div>Not Founded</div>}
						>
							<section class="container mx-auto container">
								<div class="grid grid-cols-1 sm:grid-cols-5 gap-6">
									<div class="col-span-1  sm:col-span-3  w-full gap-3 grid grid-cols-1 sm:grid-cols-6">
										<div class="hidden sm:block hide-scroll-bar overflow-y-auto max-h-[45dvh] h-screen space-y-3">
											<Show
												when={product().storeProduct.previews.length > 0}
												fallback={null}
											>
												<For each={product().storeProduct.previews}>
													{(res: string, index: Accessor<number>) => {
														return (
															<div
																onClick={() => setThumb(index())}
																class="cursor-pointer overflow-hidden border border-gray-200 rounded-md"
															>
																<img
																	alt="previews"
																	src={`${
																		import.meta.env.VITE_VARIABLE_IPFS
																	}/api/ipfs?hash=${res}`}
																	class="w-48 h-28 object-contain hover:scale-110 duration-150 "
																/>
															</div>
														);
													}}
												</For>
											</Show>
										</div>
										<div class="sm:col-span-5 overflow-hidden hidden sm:block">
											<Show
												when={product().storeProduct.previews.length <= 0}
												fallback={
													<div class="aspect-h-4 aspect-w-3 p-3 rounded-xl lg:block border mx-auto">
														<img
															src={viewImage()}
															alt=""
															class="w-full h-[43dvh] rounded-lg object-contain object-center hover:scale-105 transition-all"
														/>
													</div>
												}
											>
												<Image
													image={`${
														import.meta.env.VITE_VARIABLE_IPFS
													}/api/ipfs?hash=${product().storeProduct.thumbnail}`}
													name=""
													width="w-full"
													heigh="h-[9dvh]"
													is_scale={true}
												/>
											</Show>
										</div>
										<div class="col-span-1 block sm:hidden">
											<div class="w-full carousel rounded-box">
												<For each={product().storeProduct.previews}>
													{(res: string, index: Accessor<number>) => {
														return (
															<>
																<div class="badge badge-ghost relative left-12">
																	{index() + 1}/
																	{product().storeProduct.previews.length}
																</div>
																<div
																	class="carousel-item w-full"
																	onScroll={() => {
																		console.log("you changed");
																	}}
																	id={index().toString()}
																>
																	<img
																		src={`${
																			import.meta.env.VITE_VARIABLE_IPFS
																		}/api/ipfs?hash=${res}`}
																		class="w-full"
																		alt="Tailwind CSS Carousel component"
																	/>
																</div>
															</>
														);
													}}
												</For>
											</div>
										</div>

										<div class="col-span-6">
											{/* ------------Key features ---------- */}
											<Show
												when={product().storeProduct.detail}
												fallback={null}
											>
												<section class="mt-9">
													<h1 class="text-xl sm:text-2xl font-black mb-3">
														Description
													</h1>
													<div>
														<LexicalViewer
															data={product()?.storeProduct?.detail}
														/>
													</div>
												</section>
											</Show>
										</div>
									</div>
									<div class="col-span-1 sm:col-span-2">
										{/* -----review -------- */}

										<div class="rating rating-sm mt-3">
											<Show
												when={product().storeProduct.rating}
												fallback={null}
											>
												{Array(Math.floor(product().storeProduct.rating)).fill(
													<AiFillStar class="text-primary text-xl" />
												)}
												{5 - Math.floor(product().storeProduct.rating) == 0 ? (
													""
												) : (
													<AiFillStar class="text-gray-200 text-xl" />
												)}
											</Show>
											<A
												href="#"
												class="ml-3 text-sm font-medium text-base-content"
											>
												99+ reviews
											</A>
										</div>
										<h1 class="text-lg mb-2 font-bold tracking-tight text-gray-900 sm:text-2xl">
											{product().storeProduct.title}
										</h1>
										<div class="mt-4 lg:row-span-3 lg:mt-0">
											<h2 class="sr-only">Product information</h2>
											<p class="text-xl sm:text-3xl tracking-tight text-primary font-semibold">
												{product().storeProduct.currency === "KHR" ? "៛" : "$"}
												{product().storeProduct.price}
											</p>

											<Show when={product().storeProduct.desc} fallback={null}>
												<p class="text-base text-gray-600 mt-3">
													{product().storeProduct.desc}
												</p>
											</Show>

											<div class="mt-3">
												<Show when={product().storeProduct.variants.length > 0}>
													<h3 class="mb-5 text-lg font-medium text-gray-90">
														Variants
													</h3>
												</Show>
												<ul class="grid w-full gap-3 md:grid-cols-2">
													<For each={product().storeProduct.variants}>
														{(res) => {
															return (
																<li>
																	<input
																		type="checkbox"
																		id={res.preview}
																		name="hosting"
																		value={res.preview}
																		class="hidden peer"
																		required
																		onChange={(e) => {
																			e.preventDefault();
																			const p: ItemProduct = {
																				id: res.id,
																				name: res.name,
																				price: parseInt(res.price),
																				currency:
																					product().storeProduct.currency,
																				preview:
																					product().storeProduct.variants
																						.length > 0
																						? res.preview
																						: product().storeProduct.thumbnail,
																			};
																			const cart: CartItem = {
																				product: p,
																				quantity: 1,
																			};
																			items().map(
																				(item) => item.product.id == p.id
																			).length == 0 &&
																				setItems([...items(), cart]);

																			setActive(() => res.id);
																		}}
																	/>
																	<label
																		for={res.preview}
																		class="inline-flex items-center justify-between w-full p-3 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100"
																	>
																		<div class="block">
																			<img
																				src={`${
																					import.meta.env.VITE_VARIABLE_IPFS
																				}/api/ipfs?hash=${res.preview}`}
																				alt=""
																				class="w-full h-full rounded-md"
																			/>
																			<div class="w-full text-sm pt-2">
																				{res.label}
																			</div>
																		</div>
																	</label>
																</li>
															);
														}}
													</For>
												</ul>
											</div>

											<div class="mt-10">
												{cartItems.filter(
													(item: CartItem) => item.product.id == active()
												).length <= 0 ? (
													!isInCart(product().storeProduct.id) ? (
														<button
															onClick={(e) => {
																e.preventDefault();
																const p: ItemProduct = {
																	id: product().storeProduct.id,
																	name: product().storeProduct.title,
																	price: parseInt(product().storeProduct.price),
																	currency: product().storeProduct.currency,
																	preview: product().storeProduct.thumbnail,
																};
																product().storeProduct.variants.length > 0
																	? (addCarts(items()), setItems([]))
																	: handleAddToCart(p);
																toast.success("Added successfully!");
															}}
															class="btn rounded-full w-full bg-action/10 text-action/80 hover:text-action hover:border-action hover:bg-action/10 border-none"
														>
															Add to cart
														</button>
													) : (
														<button
															type="submit"
															onClick={(e) => {
																e.stopPropagation();
																navigate(`/cart`);
															}}
															class="btn rounded-full w-full bg-action/10 text-action/80 hover:text-action hover:border-action hover:bg-action/10 border-none"
														>
															View Cart
														</button>
													)
												) : (
													<button
														type="submit"
														onClick={(e) => {
															e.stopPropagation();
															navigate(`/cart`);
														}}
														class="btn rounded-full w-full bg-action/10 text-action/80 hover:text-action hover:border-action hover:bg-action/10 border-none"
													>
														View Cart
													</button>
												)}
											</div>
										</div>
									</div>
								</div>
							</section>
						</Show>
					</Show>
				</div>
			</div>
		</>
	);
};

export default ProductDetail;
