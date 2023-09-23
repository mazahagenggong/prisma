export const datatable = async (model: any, req: any, list_search: string[] | null = null, sort_by: any = null) => {
    try {
        let start: number;
        let length: number;

        if (typeof req.body.length === 'undefined') {
            length = 10;
        } else {
            length = parseInt(req.body.length);
        }

        if (typeof req.body.page === 'undefined') {
            start = 0;
        } else {
            start = ((parseInt(req.body.page) * length)- parseInt(req.body.length));
        }

        const search = req.body.keyword ?? '';
        const draw = req.body.draw || 1;
        type QueryType = {
            where?: any,
            take?: number,
            skip?: number,
            orderBy?: any,
        }
        let qq: QueryType = {};

        if (search !== '') {
            let query: any[] = [];
            list_search?.map((item) => {
                query.push({
                    [item]: {
                        contains: search,
                        mode: 'insensitive',
                    },
                });
            });
            qq.where = {OR: query};
        }
        if (sort_by !== null) {
            qq.orderBy = sort_by;
        }

        const dataori = await model.findMany(qq);

        if (length !== -1) {
            qq.skip = start;
            qq.take = length;
        } else {
            qq.skip = start;
        }
        const data = await model.findMany(qq);
        const count = dataori.length;

        const newdata = data.map((data: { [x: string]: any; }, index: number) => {
            const {...rest} = data;
            return {
                nomor_urut: start + index + 1,
                ...rest,
            };
        });
        return {
            draw: draw,
            length,
            start,
            page: req.body.page,
            recordsTotal: count,
            recordsFiltered: count,
            data: newdata
        };
    } catch (error) {
        console.error(error);
        return {error: 'Internal Server Error'};
    }
}