const INTERCEPTORS_KEY = "nest:interceptors";

export const UseInterceptor = (...interceptors: any[]) => {
    return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
        // method-level
        if (descriptor?.value) {
            const prev = Reflect.getMetadata(INTERCEPTORS_KEY, descriptor.value) ?? [];
            Reflect.defineMetadata(INTERCEPTORS_KEY, [...prev, ...interceptors], descriptor.value);
            return;
        }

        // controller-level
        const prev = Reflect.getMetadata(INTERCEPTORS_KEY, target) ?? [];
        Reflect.defineMetadata(INTERCEPTORS_KEY, [...prev, ...interceptors], target);
    };
};

export const getUseInterceptors = (target: any) =>
    Reflect.getMetadata(INTERCEPTORS_KEY, target) ?? [];
