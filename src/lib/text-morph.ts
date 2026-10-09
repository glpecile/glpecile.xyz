import { MorphController } from "torph";

export const textMorphOptions = {
	duration: 200,
	ease: "cubic-bezier(0.23, 1, 0.32, 1)",
	scale: false,
	respectReducedMotion: true,
};

export function createTextMorph(element: HTMLElement) {
	const controller = new MorphController();
	controller.attach(element, textMorphOptions);
	controller.update(element.textContent ?? "");

	return (text: string, animate = true) => {
		const options = { ...textMorphOptions, disabled: !animate };
		if (controller.needsRecreate(options)) controller.attach(element, options);
		controller.update(text);
	};
}
