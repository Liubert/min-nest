const FILTERS_KEY = "nest:filters";

export const UseFilter = (...filters: any[]) => {
    return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
        // method-level
        if (descriptor?.value) {
            const prev = Reflect.getMetadata(FILTERS_KEY, descriptor.value) ?? [];
            Reflect.defineMetadata(FILTERS_KEY, [...prev, ...filters], descriptor.value);
            return;
        }

        // controller-level
        const prev = Reflect.getMetadata(FILTERS_KEY, target) ?? [];
        Reflect.defineMetadata(FILTERS_KEY, [...prev, ...filters], target);
    };
};

export const getUseFilters = (target: any) =>
    Reflect.getMetadata(FILTERS_KEY, target) ?? [];
