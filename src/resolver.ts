const slugRe = /^\[(.*)\]$/;
export const isSlug = (name: string) => slugRe.test(name);

type DirItem = {
    entry: Deno.DirEntry;
    paramName?: string;
};

type ResolvedPath = {
    path: string;
    params: {
        [param: string]: string;
    };
};

const resolveSymlink = (entry: Deno.DirEntry): Deno.DirEntry => {
    if (!entry.isSymlink) {
        // nothing to resolve
        return entry;
    }

    const { isFile, isDirectory } = Deno.statSync(entry.name);
    return {
        name: Deno.realPathSync(entry.name),
        isSymlink: false,
        isFile,
        isDirectory
    };
}

const findFile = (target: string, dirEntries: Iterable<Deno.DirEntry>) => {
    for (const dirItem of dirEntries) {
        if (resolveSymlink(dirItem).isDirectory) {
            continue
        }

        if (dirItem.name.includes(target)) {
            return dirItem;
        }
    }
}

const findDir = (target: string, dirEntries: Iterable<Deno.DirEntry>): DirItem | undefined => {
    for (const dirItem of dirEntries) {
        const item = resolveSymlink(dirItem);

        if (resolveSymlink(dirItem).isFile) {
            continue
        }

        if (item.name === target) {
            return { entry: dirItem };
        }

        if (isSlug(dirItem.name)) {
            const paramName = dirItem.name.match(slugRe)![0];
            return { entry: dirItem, paramName };
        }
    }
}

export const resolve = (path: string): ResolvedPath | undefined => {
    const pathSegments = path.split('/').reverse();

    const resolvedPath: ResolvedPath = {
        path: '.',
        params: {}
    };
    while (pathSegments.length > 0) {
        const currentSegment = pathSegments.pop() as string;
        const isDir = pathSegments.length > 0;
        const dirEntries = Deno.readDirSync(resolvedPath.path);

        if (isDir) {
            const dir = findDir(currentSegment, dirEntries);
            if (dir == null) {
                return
            }

            resolvedPath.path += `/${dir.entry.name}`;
            if (dir.paramName != null) {
                resolvedPath.params = {
                    ...resolvedPath.params,
                    ...{ [dir.paramName]: currentSegment }
                };
            }
        } else {
            const file = findFile(currentSegment, dirEntries);
            if (file == null) {
                return
            }

            resolvedPath.path += `/${file.name}`;
            return resolvedPath;
        }

    }
};
