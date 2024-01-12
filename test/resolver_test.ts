import { assertEquals } from "https://deno.land/std@0.211.0/assert/mod.ts";
import { isSlug, resolve } from '#src/resolver.ts';

Deno.test("resolver", async (t) => {
	await t.step("slug regex", () => {
		assertEquals(isSlug("test[]"), false);
		assertEquals(isSlug("te[st]"), false);
		assertEquals(isSlug("t[es]t"), false);
		assertEquals(isSlug("]test["), false);
		assertEquals(isSlug("[]test"), false);

		assertEquals(isSlug("[test]"), true);
	});

	await t.step("resolve normal file", () => {
		//const res = resolve('test/testdata/page.html');
		let resolved = resolve('test/testdata/dir_test/dir_file');
		console.log(resolved);
	});
});
