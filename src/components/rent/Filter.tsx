"use client";

import { useState, useEffect, useMemo, Fragment } from "react";
import Dialog from "../common/Dialog";
import Button from "../common/Button";
import { Add, Money, Minus, Size, SearchNormal1 } from "iconsax-react";
import { ArrowDown } from "../Icons/Icons";
import CheckBox from "../common/CheckBox";
import Input from "@/components/common/Input";
import Switch from "../common/Switch";
import { useRouter, useSearchParams } from "next/navigation";
import { ClearSearchParams, returnCity } from "@/utils/utils";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { Messages } from "@/utils/messages";
import { HOUSE_TYPES } from "@/utils/countOccurrences";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "motion/react";
import { dialogVariants } from "@/utils/Animations";
import { navHeader } from "@/utils/path";

type FilterState = {
  house: string[];
  city: string[];
  deposit: [string, string];
  rent: [string, string];
  area: [string, string];
  rooms: number;
  amenities: Record<string, boolean>;
  media: Record<string, boolean>;
};

const INITIAL_FILTERS: FilterState = {
  house: [],
  city: [],
  deposit: ["0", "4٬000٬000٬000"],
  rent: ["0", "4٬000٬000٬000"],
  area: ["0", "1٬000"],
  rooms: 0,
  amenities: { elevator: false, parking: false, warehouse: false },
  media: { hasImage: false, onlyAgency: false },
};

const AMENITY_LABELS = {
  elevator: "آسانسور",
  parking: "پارکینگ",
  warehouse: "انباری",
  hasImage: "آگهی‌های عکس‌دار",
  onlyAgency: "آگهی‌های آژانس املاک",
};

const RANGE_KEYS = ["deposit", "rent", "area"] as const;
const RANGE_LABELS = { deposit: "رهن", rent: "اجاره", area: "متراژ" };
const RANGE_DEFAULTS = { deposit: ["0", "4٬000٬000٬000"], rent: ["0", "4٬000٬000٬000"], area: ["0", "1٬000"] };
const AMENITY_KEYS = Object.keys(INITIAL_FILTERS.amenities);
const MEDIA_KEYS = Object.keys(INITIAL_FILTERS.media);

const Filter = () => {
  const [open, setOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [filterShahr, setFilterShahr] = useState("");
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [dropdownStates, setDropdownStates] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const hasActiveFilter = useMemo(() => Array.from(params.keys()).filter((k) => !["filter", "limit"].includes(k)).length, [params]);

  const formatNumber = (str: string) => str.replace(/\B(?=(\d{3})+(?!\d))/g, "٬");
  const cleanNumber = (str: string) => str.replace(/[^0-9]/g, "");

  const handleClose = () => {
    setFilterShahr("");
    setOpenIndex(null);
    setOpen(false);
    setFilters(appliedFilters);
  };

  const buildFiltersFromParams = (): FilterState => ({
    house: params.getAll("house"),
    city: params.getAll("city"),
    deposit: [formatNumber(params.get("depositMin") || "0"), formatNumber(params.get("depositMax") || "4000000000")] as [string, string],
    rent: [formatNumber(params.get("rentMin") || "0"), formatNumber(params.get("rentMax") || "4000000000")] as [string, string],
    area: [formatNumber(params.get("areaMin") || "0"), formatNumber(params.get("areaMax") || "1000")] as [string, string],
    rooms: parseInt(params.get("rooms") || "0"),
    amenities: Object.fromEntries(AMENITY_KEYS.map((k) => [k, params.has(k)])) as Record<string, boolean>,
    media: Object.fromEntries(MEDIA_KEYS.map((k) => [k, params.has(k)])) as Record<string, boolean>,
  });

  useEffect(() => {
    const urlFilters = buildFiltersFromParams();
    setFilters(urlFilters);
    setAppliedFilters(urlFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const updateFilter = (key: "house" | "city", value: string) => {
    setFilters((p) => ({
      ...p,
      [key]: p[key].includes(value) ? p[key].filter((i) => i !== value) : [...p[key], value],
    }));
  };

  const updateRange = (index: 0 | 1, value: string, type: (typeof RANGE_KEYS)[number]) => {
    setFilters((p) => ({
      ...p,
      [type]: p[type].map((v, i) => (i === index ? formatNumber(cleanNumber(value)) : v)) as [string, string],
    }));
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
    router.replace(ClearSearchParams(), { scroll: false });
    handleClose();
  };

  const removeFilter = (key: string, value?: string) => {
    const newParams = new URLSearchParams(params.toString());

    if (["house", "city"].includes(key) && value) {
      const values = newParams.getAll(key).filter((v) => v !== value);
      newParams.delete(key);
      values.forEach((v) => newParams.append(key, v));
    } else if (RANGE_KEYS.includes(key as (typeof RANGE_KEYS)[number])) {
      newParams.delete(`${key}Min`);
      newParams.delete(`${key}Max`);
    } else {
      newParams.delete(key);
    }

    router.replace(`${navHeader[0].path}?${newParams.toString()}`, { scroll: false });
  };

  const applyFilters = () => {
    const query: Record<string, string | string[]> = {};

    if (filters.house.length) query.house = filters.house;
    if (filters.city.length) query.city = filters.city;

    RANGE_KEYS.forEach((key) => {
      if (filters[key][0] !== RANGE_DEFAULTS[key][0] || filters[key][1] !== RANGE_DEFAULTS[key][1]) {
        query[`${key}Min`] = filters[key][0].replace(/٬/g, "");
        query[`${key}Max`] = filters[key][1].replace(/٬/g, "");
      }
    });

    if (filters.rooms > 0) query.rooms = String(filters.rooms);

    Object.entries({ ...filters.amenities, ...filters.media }).forEach(([k, v]) => {
      if (v) query[k] = "true";
    });

    ["limit", "filter"].forEach((key) => {
      const value = params.get(key);
      if (value) query[key] = value;
    });

    const newParams = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((val) => newParams.append(k, val));
      } else {
        newParams.set(k, v);
      }
    });

    setAppliedFilters(filters);
    handleClose();
    router.replace(`${navHeader[0].path}?${newParams.toString()}`, { scroll: false });
  };

  const toggleSwitch = (category: "amenities" | "media", key: string) => setFilters((p) => ({ ...p, [category]: { ...p[category], [key]: !p[category][key] } }));

  const renderFilterButton = (key: string, label: string, onRemove: () => void) => (
    <button key={key} aria-label={`حذف ${label}`} className="flex items-center gap-x-2 text-primary bg-tint-6 px-3 py-2.5 rounded-full" onClick={onRemove}>
      {label}
      <Add className="rotate-45 size-6 stroke-primary" />
    </button>
  );

  const toggleDropdown = (key: string) => {
    setDropdownStates(dropdownStates === key ? null : key);
  };

  const renderCheckboxDropdown = (type: "house" | "city", items: string[], label: string) => {
    const dropdownKey = `${type}-dropdown`;

    return (
      <button key={dropdownKey} onClick={() => toggleDropdown(dropdownKey)} className="flex items-center gap-x-2 text-primary bg-tint-6 px-3 py-2.5 rounded-full">
        {label} ({items.length})
        <ArrowDown fill="var(--color-primary)" width="24px" height="24px" className={`duration-150 ${dropdownKey === dropdownStates ? "rotate-180" : "rotate-0"}`} />
      </button>
    );
  };

  const renderFilterButtons = () => {
    const buttons = [];

    if (appliedFilters.house.length) {
      buttons.push(renderCheckboxDropdown("house", appliedFilters.house, "نوع ملک"));
    }
    if (appliedFilters.city.length) {
      buttons.push(renderCheckboxDropdown("city", appliedFilters.city, "شهر"));
    }

    RANGE_KEYS.forEach((key) => {
      const [min, max] = appliedFilters[key];
      if (min !== RANGE_DEFAULTS[key][0] || max !== RANGE_DEFAULTS[key][1]) {
        buttons.push(renderFilterButton(key, `${RANGE_LABELS[key]}: ${min} - ${max}`, () => removeFilter(key)));
      }
    });

    if (appliedFilters.rooms > 0) {
      buttons.push(renderFilterButton("rooms", `تعداد اتاق: ${appliedFilters.rooms}`, () => removeFilter("rooms")));
    }

    [...AMENITY_KEYS, ...MEDIA_KEYS].forEach((key) => {
      const isActive = key in appliedFilters.amenities ? appliedFilters.amenities[key] : appliedFilters.media[key];
      if (isActive) {
        buttons.push(renderFilterButton(key, AMENITY_LABELS[key as keyof typeof AMENITY_LABELS], () => removeFilter(key)));
      }
    });

    return buttons;
  };

  const cities = useMemo(() => returnCity(filterShahr), [filterShahr]);

  const renderSwitches = (keys: string[], category: "amenities" | "media") => (
    <div className="flex flex-col gap-y-3">
      {keys.map((key) => (
        <div key={key} className="flex items-center justify-between">
          <span className="text-sm">{AMENITY_LABELS[key as keyof typeof AMENITY_LABELS]}</span>
          <Switch checked={filters[category][key]} onChange={() => toggleSwitch(category, key)} />
        </div>
      ))}
    </div>
  );

  const renderFilterCheckBpx = (type: "house" | "city", item: string) => (
    <div className="flex items-center justify-between py-2 pl-1 pr-3 rounded-md hover:bg-g8">
      <span className="text-base">{item}</span>
      <button onClick={() => removeFilter(type, item)} className="text-states-error1 hover:text-red-700">
        <Add className="rotate-45 stroke-current size-7" />
      </button>
    </div>
  );

  const filterSections = [
    {
      label: "نوع ملک",
      content: HOUSE_TYPES.map((e) => <CheckBox key={e} id={e} label={e} labelClassName="text-body-xxs" checked={filters.house.includes(e)} onChange={() => updateFilter("house", e)} />),
    },
    {
      label: "شهر",
      content: (
        <div className="w-full space-y-3">
          <Input inputClassName="w-full h-12" Icon={SearchNormal1} ResetValue={() => setFilterShahr("")} error="" id="search" name="search" value={filterShahr} label="جستجو" onChange={(e) => setFilterShahr(e.target.value)} />
          {cities.length ? (
            <List height={150} itemCount={cities.length} itemSize={30} width="100%">
              {({ index, style }: ListChildComponentProps) => (
                <div style={style} dir="rtl">
                  <CheckBox key={cities[index]} id={cities[index]} label={cities[index]} labelClassName="text-body-xxs" checked={filters.city.includes(cities[index])} onChange={() => updateFilter("city", cities[index])} />
                </div>
              )}
            </List>
          ) : (
            <p className="py-2 text-sm text-g7 text-start">{Messages.noSearchResults.title}</p>
          )}
        </div>
      ),
    },
    ...RANGE_KEYS.map((key) => ({
      label: RANGE_LABELS[key],
      content: [0, 1].map((i) => (
        <div key={i} className="flex items-center gap-x-4">
          <p className="text-body-xxs text-g2">{i ? "تا" : "از"}</p>
          <Input Icon={key === "area" ? Size : Money} ResetValue={() => setFilters((p) => ({ ...p, [key]: INITIAL_FILTERS[key] }))} error="" id={`${key}-${i}`} name={`${key}-${i}`} value={filters[key][i]} label="" onChange={(e) => updateRange(i as 0 | 1, e.target.value, key)} />
        </div>
      )),
    })),
    {
      label: "تعداد اتاق",
      content: (
        <div className="flex items-center justify-between h-10 p-2 border rounded-full w-72 border-g9">
          <button onClick={() => setFilters((p) => ({ ...p, rooms: p.rooms + 1 }))}>
            <Add className="size-6 stroke-g3" />
          </button>
          {filters.rooms} اتاق
          <button onClick={() => setFilters((p) => ({ ...p, rooms: Math.max(0, p.rooms - 1) }))}>
            <Minus className="size-6 stroke-g3" />
          </button>
        </div>
      ),
    },
    { label: "امکانات", content: renderSwitches(AMENITY_KEYS, "amenities") },
    { label: "امکانات تصویری آگهی", content: renderSwitches(MEDIA_KEYS, "media") },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <>
      <div className="w-full h-18 bg-white padding-body !pl-0 flex items-center py-4">
        <button onClick={() => setOpen(true)} className={`flex items-center gap-x-1 py-2 px-3 relative rounded-full border ${hasActiveFilter ? "text-white bg-primary border-primary" : "text-primary border-g9 hover:bg-g9"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 -960 960 960" fill="currentcolor">
            <path d="M440-240q-17 0-28.5-11.5T400-280q0-17 11.5-28.5T440-320h80q17 0 28.5 11.5T560-280q0 17-11.5 28.5T520-240h-80ZM280-440q-17 0-28.5-11.5T240-480q0-17 11.5-28.5T280-520h400q17 0 28.5 11.5T720-480q0 17-11.5 28.5T680-440H280ZM160-640q-17 0-28.5-11.5T120-680q0-17 11.5-28.5T160-720h640q17 0 28.5 11.5T840-680q0 17-11.5 28.5T800-640H160Z" />
          </svg>
          فیلترها
          {hasActiveFilter > 0 && <div className="absolute flex items-center justify-center text-white border-4 border-white rounded-full size-10 scale-55 bg-states-error1 -left-5 -top-3">{hasActiveFilter}</div>}
        </button>
        <div className="w-0.5 h-full bg-g9 mr-6" />

        <Swiper className="mySwiper flex-1 !mr-4" slidesPerView="auto" allowTouchMove grabCursor>
          {renderFilterButtons().map((btn, i) => (
            <SwiperSlide key={i} className={`!w-auto ${i === 0 ? "pl-2 sm:pl-4" : "px-2 sm:px-4"}`}>
              {btn}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Dialog open={(dropdownStates === "house-dropdown" && appliedFilters.house.length > 0) || (dropdownStates === "city-dropdown" && appliedFilters.city.length > 0)} close={() => setDropdownStates(null)}>
        <motion.div variants={dialogVariants} initial="hidden" animate={(dropdownStates === "house-dropdown" && appliedFilters.house.length > 0) || (dropdownStates === "city-dropdown" && appliedFilters.city.length > 0) ? "visible" : "hidden"} exit="exit" onClick={(e) => e.stopPropagation()} className="w-[95%] sm:w-[600px] min-h-[600px] max-h-[95%] flex flex-col bg-white rounded-xl overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between w-full p-6 pb-4 bg-white border-b">
            <p className="text-lg font-bold">{dropdownStates === "house-dropdown" ? "نوع ملک" : "شهر"}</p>
            <button onClick={() => setDropdownStates(null)} className="rounded-full hover:bg-g8">
              <Add className="rotate-45 size-9 stroke-black" />
            </button>
          </div>

          <div className="p-6 pb-2">
            {dropdownStates === "house-dropdown" && appliedFilters.house.map((item) => <Fragment key={item}>{renderFilterCheckBpx("house", item)}</Fragment>)}

            {dropdownStates === "city-dropdown" && appliedFilters.city.map((item) => <Fragment key={item}>{renderFilterCheckBpx("city", item)}</Fragment>)}
          </div>
        </motion.div>
      </Dialog>

      <Dialog open={open} close={handleClose}>
        <motion.div variants={dialogVariants} initial="hidden" animate={open ? "visible" : "hidden"} exit="exit" onClick={(e) => e.stopPropagation()} className="w-[95%] sm:w-[600px] min-h-[600px] max-h-[95%] flex flex-col bg-white rounded-xl overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between w-full p-6 pb-4 bg-white border-b">
            <p className="text-lg font-bold">فیلترها</p>
            <button onClick={() => setOpen(false)} className="rounded-full hover:bg-g8">
              <Add className="rotate-45 size-9 stroke-black" />
            </button>
          </div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="flex flex-col w-full">
            {filterSections.map((item, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`w-full flex flex-col gap-y-6 ${i < filterSections.length - 1 ? "border-b" : ""}`}
              >
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className={`w-full flex items-center justify-between px-6 ${openIndex === i ? "pt-4" : "py-4"}`}>
                  <p className="text-sm font-medium">{item.label}</p>
                  <ArrowDown fill="var(--color-black)" width="24px" height="24px" className={`duration-150 translate-x-[5px] ${openIndex === i ? "rotate-180" : "rotate-0"}`} />
                </button>
                {i === openIndex && <div className="w-full flex flex-col px-6 gap-y-2.5 pb-4">{item.content}</div>}
              </motion.div>
            ))}
          </motion.div>

          <div className="w-full flex items-center gap-x-1.5 mt-4 px-6 pb-6 sticky bottom-0 z-10 bg-white">
            <Button width="w-fit" className="flex-1" height="h-12" variant="normal" onClick={clearFilters}>
              حذف همه
            </Button>
            <Button width="w-fit" className="flex-1" height="h-12" variant="fill" onClick={applyFilters}>
              مشاهده نتایج
            </Button>
          </div>
        </motion.div>
      </Dialog>
    </>
  );
};

export default Filter;
