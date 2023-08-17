import _ from 'lodash';
import Link from 'next/link';

type PagerOptions = {
  pageSize?: number;
  page: number;
  total: number;
  totalPage: number;
  urlMaker?: (n: number) => string;
};

const defaultUrlMaker = (n: number) => `?page=${n}`;

export function usePager(options: PagerOptions) {
  const { page, total, totalPage, urlMaker: _urlMaker } = options;
  const urlMaker = _urlMaker || defaultUrlMaker;

  const numbers = [];
  numbers.push(1);
  for (let i = page - 3; i <= page + 3; i++) {
    numbers.push(i);
  }
  numbers.push(totalPage);
  const pageNumbers = _.uniq(numbers)
    .sort()
    .filter((n) => n >= 1 && n <= totalPage)
    .reduce(
      (result, n) =>
        n - (result[result.length - 1] || 0) === 1 ? result.concat(n) : result.concat(-1, n),
      [],
    );

  const pager = (
    <div className="wrapper">
      <style jsx>{`
        .wrapper {
          margin: 0 -8px;
        }
        .wrapper > a,
        .wrapper > span {
          margin: 0 8px;
        }
      `}</style>

      <span> 共{total}条数据</span>

      {pageNumbers.map((n) =>
        n === -1 ? (
          <span>...</span>
        ) : (
          <Link key={n} href={urlMaker(n)}>
            <a>{n}</a>
          </Link>
        ),
      )}

      <span>
        当前页{page}/{totalPage}
      </span>

      {page > 1 && (
        <Link href={urlMaker(page - 1)}>
          <a>上一页</a>
        </Link>
      )}

      {page < totalPage && (
        <Link href={urlMaker(page + 1)}>
          <a>下一页</a>
        </Link>
      )}
    </div>
  );
  return { pager };
}
