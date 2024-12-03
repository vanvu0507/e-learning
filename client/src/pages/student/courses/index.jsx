import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { checkCoursePurchaseInfoService, fetchStudentViewCourseListService } from "@/services";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
    const queryParams = [];

    for(const [key, value] of Object.entries(filterParams)) {
        if(Array.isArray(value) && value.length > 0) {
            const paramValue = value.join(',');

            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
        }
    }

    return queryParams.join('&');
};

function StudentViewCoursesPage() {
    const [sort, setSort] = useState("price-lowtohigh");
    const [filters, setFilters] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const { studentViewCoursesList, setStudentViewCoursesList, loadingState, setLoadingState } = useContext(StudentContext);
    const navigate = useNavigate();
    const {auth} = useContext(AuthContext);
    
    const location = useLocation();  // Lấy location của trang hiện tại
    const { category, level, title, instructorName } = location.state || {}; // Lấy state từ location, hoặc {} nếu không có state
    const { searchQuery } = useContext(StudentContext);

    function handleFilterOnChange(getSectionId, getCurrentOption) {
        let cpyFilters = {...filters};
        const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

        if(indexOfCurrentSection === -1) {
            cpyFilters = {
                ...cpyFilters,
                [getSectionId] : [getCurrentOption.id]
            }
        } 
        else {
            const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption.id);

            if(indexOfCurrentOption === -1) cpyFilters[getSectionId].push(getCurrentOption.id)
            else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);        
        }        
        setFilters(cpyFilters);
        // sessionStorage.setItem('filters', JSON.stringify(cpyFilters));
    };

    async function fetchAllStudentViewCourses(filters, sort) {
        
        const query = new URLSearchParams({
            ...filters,
        });
               
        const response = await fetchStudentViewCourseListService(query);
        if(response?.success) {
            setStudentViewCoursesList(response?.data);
            setLoadingState(false);
        };
    }

    async function handleCourseNavigate(getCurrentCourseId) {
        const response = await checkCoursePurchaseInfoService(
            getCurrentCourseId, 
            auth?.user?._id
        );

        if(response?.success) {
            if(response?.data) {
                navigate(`/course-progress/${getCurrentCourseId}`);
            }
            else {
                navigate(`/course/details/${getCurrentCourseId}`);
            }
        }
    }
    
    useEffect(() => {
        const buildQueryStringForFilters = createSearchParamsHelper(filters);
        setSearchParams(new URLSearchParams(buildQueryStringForFilters))         
    },[filters]);

    useEffect(() => {
        // Nếu có dữ liệu từ searchQuery, cập nhật filters
        if (searchQuery) {
            const newFilters = { ...filters };
    
            // if (category) {
            //     newFilters.category = [category];
            // }
    
            // if (level) {
            //     newFilters.level = [level];
            // }

            // if (instructorName) {
            //     newFilters.instructorName = [instructorName];
            // }
    
            // if (title) {
            //     // Nếu bạn cần tìm kiếm theo tiêu đề, bạn có thể sử dụng trường title cho một API tìm kiếm khác
            //     // Ở đây, chúng ta không đưa tiêu đề vào filters mà chỉ dùng khi cần
            //     newFilters.title = [title];
            // }

            if(searchQuery) {
                newFilters.searchQuery = [searchQuery];
            }
            setFilters(newFilters); // Cập nhật filters state
            console.log(filters);
        }
    }, [searchQuery]); // Chỉ chạy khi category, level, hoặc title thay đổi

    useEffect(() => {
        setSort('price-lowtohigh');
        // setFilters(JSON.parse(sessionStorage.getItem('filters')) || {});
    }, [])

    useEffect(() => {
        if(filters) {
            fetchAllStudentViewCourses(filters, sort);
        } 
    }, [filters, sort]);

    useEffect(() => {
       return () => {
        // sessionStorage.removeItem("filters")
       } 
    }, []);

    // console.log(loadingState, '');

    return (
        <div
        className="container mx-auto p-4"
        >
            <h1
            className="text-3xl font-bold mb-4"
            >
                All Courses
            </h1>
            <div
            className="flex flex-col md:flex-row gap-4"
            >
                <aside
                className="w-full md:w-64 space-y-4"
                >
                    <div
                    >
                        {
                            Object.keys(filterOptions).map(keyItem => (
                                <div
                                className="p-4 border-b"
                                >
                                    <h3
                                    className="font-bold mb-3"
                                    >
                                        {keyItem.toUpperCase()}
                                    </h3>
                                    <div
                                    className="grid gap-2 mt-2"
                                    >
                                        {
                                            filterOptions[keyItem].map(option => (
                                                <Label
                                                className="flex font-medium items-center gap-3"
                                                >
                                                    <Checkbox 
                                                    checked={
                                                        filters &&
                                                        Object.keys(filters).length > 0 
                                                        && filters[keyItem] &&
                                                        filters[keyItem].indexOf(option.id) > -1
                                                    }
                                                    onCheckedChange={()=> handleFilterOnChange(keyItem, option)}
                                                    />
                                                    {option.label}
                                                </Label>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </aside>
                <main
                className="flex-1"
                >
                    <div
                    className="flex justify-end items-center mb-4 gap-5"
                    >
                        <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-2 p-5" 
                                >
                                    <ArrowUpDownIcon 
                                    className="h-4 w-4"
                                    />
                                    <span
                                    className="text-[16px] font-medium"
                                    >Sort By</span>
                                </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent
                             align="end"
                             className="w-[180px]"
                             >
                                <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value)}>
                                    {
                                        sortOptions.map(sortItem => 
                                            <DropdownMenuRadioItem
                                            value={sortItem.id}
                                            key={sortItem.id}
                                            >
                                                {sortItem.label}
                                            </DropdownMenuRadioItem>
                                        )
                                    }
                                </DropdownMenuRadioGroup>
                             </DropdownMenuContent>
                        </DropdownMenu>
                        <span
                        className="text-sm text-black font-bold"
                        >{studentViewCoursesList.length} Results
                        </span>
                    </div>
                    <div
                    className="space-y-4"
                    >
                    {/* <h2 className="text-xl font-semibold mb-4">
                        {title ? `Search results for "${title}"` : "Courses"}
                    </h2> */}
                        {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                                studentViewCoursesList.map(courseItem =>(
                                    <Card onClick={() => handleCourseNavigate(courseItem?._id)} className="cursor-pointer" key={courseItem?._id}>
                                        <CardContent 
                                        className = "flex gap-4 p-4"
                                        >
                                            <div 
                                            className="w-48 h-32 flex-shrink-0"
                                            >
                                                <img 
                                                src={courseItem.image}
                                                className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div
                                            className="flex-1"
                                            >
                                                <CardTitle
                                                className="text-xl mb-2"
                                                >
                                                    {courseItem?.title}
                                                </CardTitle>
                                                <p 
                                                className="text-sm text-gray-600 mb-1"
                                                >
                                                    Created By <span className="font-bold">{courseItem?.instructorName}</span>
                                                </p>
                                                <p className="text-[16px] text-gray-600 mt-3 mb-2">
                                                    {
                                                        `${
                                                            courseItem?.curriculum?.length
                                                        } ${courseItem?.curriculum?.length <=1 ? "Lecture" : "Lectures"} 
                                                        - ${courseItem?.level.toUpperCase()} Level`
                                                    }
                                                </p>
                                                <p
                                                className="font-bold text-lg"
                                                >
                                                    ${courseItem?.pricing}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                                )
                        ) : loadingState ? (
                                <Skeleton /> 
                        ) : ( 
                            <h1 className="font-extrabold text-4xl">No Courses Found</h1>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default StudentViewCoursesPage;