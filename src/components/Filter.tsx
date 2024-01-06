import { For, Show, createEffect, createSignal } from "solid-js";
import { A, useNavigate, useSearchParams } from "solid-start";
import { publicQuery } from "~/libs/client";
import { TAGS } from "~/libs/graphql/tag";

export const Filter = () => {
  const [ps] = useSearchParams();
  const navigate = useNavigate();
  const [value, setValue] = createSignal("");
  const [tags] = publicQuery(TAGS);

  return (
    <div class="mt-8 space-y-8">
      <form>
        <input
          class="input input-bordered w-full"
          onInput={(e) => {
            setValue(e.target.value),
              navigate(
                `/products?search=${value() ? value() : ""}&tag=${
                  ps.tag ? ps.tag : ""
                }`
              );
          }}
          type="text"
          placeholder="Search"
        />
      </form>
      <h5 class="inline-flex items-center text-base font-semibold text-gray-400">
        Filters
      </h5>
      <form class="my-4 border-y border-gray-200">
        <ul class="space-y-4 px-4 py-3 border-gray-200 pb-6 text-sm text-gray-600">
          <Show when={tags()?.tags} fallback={<div>loading...</div>}>
            <For each={tags().tags} fallback={<div>Not founded</div>}>
              {(tag) => {
                return (
                  <li>
                    <A
                      href={`/products?search=${
                        ps.search ? ps.search : ""
                      }&tag=${tag.id}`}
                    >
                      {tag.titleEn}
                    </A>
                  </li>
                );
              }}
            </For>
          </Show>
        </ul>
      </form>
      <h5 class="inline-flex items-center text-base font-medium text-gray-400">
        Categories
      </h5>
      <form class="my-4 border-gray-200">
        <div class="space-y-4 px-4 py-1 border-gray-200 pb-6 text-sm text-gray-600">
          <div class="flex items-center">
            <input
              id="filter-category-0"
              name="category[]"
              value="new-arrivals"
              type="checkbox"
              class="checkbox checkbox-sm"
            />
            <label for="filter-category-0" class="ml-3 text-sm text-gray-600">
              RIBBON
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="filter-category-1"
              name="category[]"
              value="sale"
              type="checkbox"
              class="checkbox checkbox-sm"
            />
            <label for="filter-category-1" class="ml-3 text-sm text-gray-600">
              EVOLIS
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="filter-category-2"
              name="category[]"
              value="travel"
              type="checkbox"
              checked
              class="checkbox checkbox-sm"
            />
            <label for="filter-category-2" class="ml-3 text-sm text-gray-600">
              FUJIFILM
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="filter-category-3"
              name="category[]"
              value="organization"
              type="checkbox"
              class="checkbox checkbox-sm"
            />
            <label for="filter-category-3" class="ml-3 text-sm text-gray-600">
              HP
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="filter-category-4"
              name="category[]"
              value="accessories"
              type="checkbox"
              class="checkbox checkbox-sm"
            />
            <label for="filter-category-4" class="ml-3 text-sm text-gray-600">
              DELL
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="filter-category-4"
              name="category[]"
              value="accessories"
              type="checkbox"
              class="checkbox checkbox-sm"
            />
            <label for="filter-category-4" class="ml-3 text-sm text-gray-600">
              SONY
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
