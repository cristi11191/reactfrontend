const flattenPermissions = (permissionsObj) => {
    const result = [];
    const recurse = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                recurse(obj[key]);
            } else {
                result.push(obj[key]);
            }
        }
    };
    recurse(permissionsObj);
    return result;
};

export default flattenPermissions;