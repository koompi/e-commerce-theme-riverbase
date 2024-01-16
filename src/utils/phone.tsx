import React, { createEffect, createSignal } from "solid-js";

const initialNetwork = "";
const initialColor = "";

const Operators = [
	// SMART
	{ name: "Smart", prefix: "010", min: 6, max: 6 },
	{ name: "Smart", prefix: "015", min: 6, max: 6 },
	{ name: "Smart", prefix: "016", min: 6, max: 6 },
	{ name: "Smart", prefix: "069", min: 6, max: 6 },
	{ name: "Smart", prefix: "070", min: 6, max: 6 },
	{ name: "Smart", prefix: "081", min: 6, max: 6 },
	{ name: "Smart", prefix: "086", min: 6, max: 6 },
	{ name: "Smart", prefix: "087", min: 6, max: 6 },
	{ name: "Smart", prefix: "093", min: 6, max: 6 },
	{ name: "Smart", prefix: "096", min: 7, max: 7 },
	{ name: "Smart", prefix: "098", min: 6, max: 6 },
	// Cellcard
	{ name: "Cellcard", prefix: "011", min: 6, max: 6 },
	{ name: "Cellcard", prefix: "012", min: 6, max: 7 },
	{ name: "Cellcard", prefix: "014", min: 6, max: 6 },
	{ name: "Cellcard", prefix: "017", min: 6, max: 6 },
	{ name: "Cellcard", prefix: "061", min: 6, max: 6 },
	{ name: "Cellcard", prefix: "076", min: 7, max: 7 },
	{ name: "Cellcard", prefix: "077", min: 6, max: 6 },
	{ name: "Cellcard", prefix: "078", min: 6, max: 6 },
	{ name: "Cellcard", prefix: "079", min: 6, max: 6 },
	{ name: "Cellcard", prefix: "085", min: 6, max: 6 },
	{ name: "Cellcard", prefix: "089", min: 6, max: 6 },
	{ name: "Cellcard", prefix: "092", min: 6, max: 6 },
	{ name: "Cellcard", prefix: "095", min: 6, max: 6 },
	{ name: "Cellcard", prefix: "099", min: 6, max: 6 },
	// METFONE
	{ name: "Metfone", prefix: "031", min: 7, max: 7 },
	{ name: "Metfone", prefix: "060", min: 6, max: 6 },
	{ name: "Metfone", prefix: "066", min: 6, max: 6 },
	{ name: "Metfone", prefix: "067", min: 6, max: 6 },
	{ name: "Metfone", prefix: "068", min: 6, max: 6 },
	{ name: "Metfone", prefix: "071", min: 7, max: 7 },
	{ name: "Metfone", prefix: "088", min: 7, max: 7 },
	{ name: "Metfone", prefix: "090", min: 6, max: 6 },
	{ name: "Metfone", prefix: "097", min: 7, max: 7 },
	// SEATEL
	{ name: "SEATEL", prefix: "018", min: 7, max: 7 },
];

function createError({ name, message }: { name: string; message: string }) {
	const error: any = new Error(name);
	error["detail"] = { name, message };
	throw error;
}

export function validateNumber({ phoneNumber }: { phoneNumber: string }) {
	// remove whiteSpace
	const NumberOnly = phoneNumber.replace(/\D/g, "");
	const ZeroSpacephoneNumber = NumberOnly.replace(" ", "");

	if (ZeroSpacephoneNumber.includes("+"))
		createError({
			name: "ValidationError",
			message: "International phone number format is not currently supported.",
		});
	const zeroPrefix = ZeroSpacephoneNumber.substring(0, 1);

	if (zeroPrefix !== "0")
		createError({
			name: "ValidationError",
			message: "Invalid phone number",
		});

	const prefix = ZeroSpacephoneNumber.substring(0, 3);

	const prefixInfo = Operators?.filter((o) => o.prefix === prefix);

	if (prefixInfo.length === 0)
		createError({
			name: "ValidationError",
			message:
				"Invalid prefix. No such service operator using that prefix in Cambodia",
		});

	const number = ZeroSpacephoneNumber.substring(3);
	const { prefix: pre, min, max } = prefixInfo[0];

	const isFixed = min === max ? true : false;
	const isOffRanged = number.length < min || number.length > max ? true : false;

	if (isOffRanged)
		createError({
			name: "ValidationError",
			message: `Invalid phone number. ${pre}'s number ${
				isFixed
					? `is only ${min} degits!`
					: `is only ranged between ${min} to ${max} degits!`
			}`,
		});

	return prefixInfo[0];
}

export default function PhoneBadge({
	phoneNumber,
	size,
}: {
	phoneNumber: string;
	size: number;
}) {
	const [network, setNetwork] = createSignal(initialNetwork);
	const [color, setColor] = createSignal(initialColor);

	createEffect(() => {
		let valid = null;
		if (phoneNumber) {
			const isvalid = validateNumber({ phoneNumber });
			if (isvalid.name) {
				valid = isvalid;
			}
		}
		if (valid) {
			setNetwork(valid.name);
		}
	}, []);

	createEffect(() => {
		if (network().toLocaleLowerCase() === "Cellcard") {
			setColor("badge-warning text-warning-content");
		}
		if (network().toLocaleLowerCase() === "smart") {
			setColor("badge-success text-success-content");
		}
		if (network().toLocaleLowerCase() === "metfone") {
			setColor("badge-error text-error-content");
		}
	}, [network]);

	return (
		<div class={`badge ${color} badge-sm block mb-1 ${size || "badge-sm"}`}>
			{network()}: {phoneNumber}
		</div>
	);
}
