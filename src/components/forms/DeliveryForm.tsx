import {
	Component,
	Match,
	Show,
	Switch,
	createEffect,
	createSignal,
} from "solid-js";
import {
	SubmitHandler,
	createForm,
	email,
	required,
} from "@modular-forms/solid";
import axios, { AxiosResponse } from "axios";

import Button from "../Button";
import { CREATE_DELIVERY } from "~/libs/graphql/delivery";
import { DeliveryType } from "~/types/checkout";
import { client } from "~/libs/client";
import toast from "solid-toast";
import { useAuth } from "~/contexts/useAuth";
import { validateNumber } from "~/utils/phone";

const initialNewPhone = {
	phoneNumber: "",
	isInternal: false,
	isVerified: false,
	isActived: false,
	isBanned: false,
};

export const DeliveryForm: Component<{ refetch: Function }> = (props) => {
	const { user } = useAuth();
	const [_, { Form, Field }] = createForm<DeliveryType>();
	const [photo, setPhoto] = createSignal<string>();

	const [newPhone, setNewPhone] = createSignal(initialNewPhone);
	const [isBlurred, setIsBlurred] = createSignal(false);
	const [operator, setOperator] = createSignal("");
	const [isValid, setIsValid] = createSignal(false);
	const [color, setColor] = createSignal("");
	const [validationMessage, setValidationMessage] = createSignal("");

	let inputRef: HTMLInputElement | ((el: HTMLInputElement) => void) | undefined;
	const [files, setFiles] = createSignal<File>();

	createEffect(() => {
		if (operator().toLocaleLowerCase() === "Cellcard") {
			setColor("bg-orange-600 text-white");
		}
		if (operator().toLocaleLowerCase() === "smart") {
			setColor("bg-green-600 text-white");
		}
		if (operator().toLocaleLowerCase() === "metfone") {
			setColor("bg-red-600 text-white");
		}
	});

	createEffect(() => {
		if (newPhone().phoneNumber !== "" && isBlurred()) {
			try {
				const valid = validateNumber({ phoneNumber: newPhone().phoneNumber });
				if (valid.name) {
					setIsValid(true);
					setValidationMessage("");
					setOperator(valid.name);
				}
			} catch (error: any) {
				if (error) {
					setIsValid(false);
					setValidationMessage(error.detail.message);
					setOperator("");
				}
			}
		}
	});

	const handleSubmit: SubmitHandler<DeliveryType> = (values, _) => {
		if (!isValid()) {
			toast.error("Please check your phone number");
			return;
		}
		client
			.mutation(CREATE_DELIVERY, {
				input: { ...values, phoneNumber: newPhone().phoneNumber },
			})
			.toPromise()
			.then((res) => {
				if (res.error) {
					return toast.error(res.error.message);
				}
				props.refetch();
				toast.success(res.data.storeCreateDelivery.message);
			});
	};

	async function handleChange(e: any) {
		e.preventDefault();
		toast.success("File has been added");
		if (e.target.files) {
			setFiles(e.target.files[0]);
		}

		const body = {
			upload: files(),
		};

		axios
			.post(
				`https://backend.riverbase.org/api/upload/image/${user()._id}`,
				body,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			)
			.then((res: AxiosResponse<any, any>) => {
				setPhoto(res.data.path);
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	function handleNewPhoneChange(e: any) {
		const { name, value } = e.target;
		const object = {
			...newPhone(),
			[name]: value,
		};
		setNewPhone(() => object);
	}

	return (
		<Form onSubmit={handleSubmit} class="space-y-4 md:space-y-6 w-full">
			<Field
				name="photos"
				// validate={[required("Please enter your first name.")]}
			>
				{(field, props) => (
					<div
						class="w-full relative bg-primary/10 rounded-lg p-6 cursor-pointer"
						id="dropzone"
					>
						<input
							{...props}
							type="file"
							required
							placeholder="First Name"
							class="file-input absolute w-full inset-0 h-full opacity-0 z-50 cursor-pointer"
							onChange={handleChange}
							ref={inputRef}
						/>
						{field.error && (
							<div class="text-sm text-red-600 dark:text-red-500">
								{field.error}
							</div>
						)}
						<div class="text-center">
							<Show when={!photo()} fallback={null}>
								<img class="mx-auto h-24 w-24" src="/images/shop.png" alt="" />

								<h3 class="mt-2 text-sm font-medium text-gray-900">
									<label for="file-upload" class="relative cursor-pointer">
										<span>Browse to upload your place</span>
										<input
											id="file-upload"
											name="file-upload"
											type="file"
											class="sr-only"
											onChange={handleChange}
											ref={inputRef}
										/>
									</label>
								</h3>
								<p class="mt-1 text-xs text-gray-500">
									PNG, JPG, GIF up to 2MB
								</p>
							</Show>
							<Show when={photo()} fallback={null}>
								<img
									class="mx-auto w-full object-contain cursor-pointer"
									src={photo()}
									alt=""
								/>
							</Show>
						</div>
					</div>
				)}
			</Field>
			<div class="grid grid-cols-2 space-x-4">
				<Field
					name="firstName"
					validate={[required("Please enter your first name.")]}
				>
					{(field, props) => (
						<div>
							<label class="label">
								<span class="label-text">First Name</span>
							</label>
							<input
								{...props}
								type="text"
								required
								// placeholder="First Name"
								class="input input-bordered w-full"
							/>
							{field.error && (
								<div class="text-sm text-red-600 dark:text-red-500">
									{field.error}
								</div>
							)}
						</div>
					)}
				</Field>
				<Field
					name="lastName"
					validate={[required("Please enter your last name.")]}
				>
					{(field, props) => (
						<div>
							<label class="label">
								<span class="label-text">Last Name</span>
							</label>
							<input
								{...props}
								type="text"
								required
								// placeholder="Last Name"
								class="input input-bordered w-full"
							/>
							{field.error && (
								<div class="text-sm text-red-600 dark:text-red-500">
									{field.error}
								</div>
							)}
						</div>
					)}
				</Field>
			</div>
			<div class="grid grid-cols-2">
				<Field
					name="address"
					validate={[required("Please enter your address.")]}
				>
					{(field, props) => (
						<div class="col-span-2">
							<label class="label">
								<span class="label-text">Address</span>
							</label>
							<input
								{...props}
								type="text"
								required
								// placeholder="Address"
								class="input input-bordered w-full"
							/>
						</div>
					)}
				</Field>
			</div>
			<div class="form-control">
				<label class="label">
					<span class="label-text">Phone number</span>
					<Switch>
						<Match when={operator() === "Smart"}>
							<span
								class={`label-text-alt badge badge-sm block mb-1 bg-green-600 text-white`}
							>
								{operator()}
							</span>
						</Match>
						<Match when={operator() === "Cellcard"}>
							<span
								class={`label-text-alt badge badge-sm block mb-1 bg-orange-500 text-white`}
							>
								{operator()}
							</span>
						</Match>
						<Match when={operator() === "Metfone"}>
							<span
								class={`label-text-alt badge badge-sm block mb-1 bg-red-600 text-white`}
							>
								{operator()}
							</span>
						</Match>
					</Switch>
				</label>
				<input
					type="text"
					class="w-full input input-bordered"
					name="phoneNumber"
					value={newPhone().phoneNumber}
					onChange={handleNewPhoneChange}
					onBlur={() => setIsBlurred(true)}
				/>
				{validationMessage() !== "" && (
					<label class="label">
						<span class="label-text-alt text-error">{validationMessage()}</span>
					</label>
				)}
			</div>
			<div class=" grid-cols-2 space-x-4 hidden">
				<Field
					name="email"
					validate={[
						required("Please enter your email."),
						email("The email address is badly formatted."),
					]}
				>
					{(field, props) => (
						<div>
							<label class="label">
								<span class="label-text">Email</span>
							</label>
							<input
								{...props}
								type="email"
								required
								// placeholder="Email"
								pattern="[^ @]*@[^ @]*"
								class="input input-bordered w-full"
								value="default@gmail.com"
							/>
							{field.error && (
								<div class="text-sm text-red-600 dark:text-red-500">
									{field.error}
								</div>
							)}
						</div>
					)}
				</Field>
			</div>
			<div class="flex justify-end w-full">
				<button
					disabled={!isValid() ? true : false}
					class="rounded-box w-full btn btn-primary"
					type="submit"
				>
					Save & Continue
				</button>
			</div>
		</Form>
	);
};
